import { withSupabase } from 'npm:@supabase/server@^1'

type JsonObject = Record<string, unknown>

interface AddressPayload {
  address_line_1: string
  address_line_2: string
  city: string
  region: string
  postcode: string
  country: string
}

interface NormalizedCheckoutPayload {
  idempotency_key: string
  idempotency_hash: string
  customer: {
    email: string
    phone: string
    first_name: string
    last_name: string
    company: string
  }
  delivery_address: AddressPayload
  billing_address: AddressPayload
  notes: string
  lines: Array<{ variant_id: string; quantity: number }>
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function asObject(value: unknown): JsonObject | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : null
}

function normalizeText(value: unknown): string | null {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : null
}

function normalizeRequired(value: unknown): string | null {
  const normalized = normalizeText(value)
  return normalized ? normalized : null
}

function normalizeAddress(value: unknown): AddressPayload | null {
  const address = asObject(value)
  if (!address) return null

  const addressLine1 = normalizeRequired(address.address_line_1)
  const city = normalizeRequired(address.city)
  const postcode = normalizeRequired(address.postcode)
  const country = normalizeRequired(address.country)
  if (!addressLine1 || !city || !postcode || !country) return null

  return {
    address_line_1: addressLine1,
    address_line_2: normalizeText(address.address_line_2) ?? '',
    city,
    region: normalizeText(address.region) ?? '',
    postcode,
    country,
  }
}

function normalizeCheckoutRequest(value: unknown): Omit<NormalizedCheckoutPayload, 'idempotency_hash'> | null {
  const request = asObject(value)
  if (!request) return null

  const idempotencyKey = normalizeRequired(request.idempotency_key)
  const customer = asObject(request.customer)
  const email = normalizeRequired(customer?.email)?.toLowerCase()
  const phone = normalizeRequired(customer?.phone)
  const firstName = normalizeRequired(customer?.first_name)
  const lastName = normalizeRequired(customer?.last_name)
  const deliveryAddress = normalizeAddress(request.delivery_address)
  const billingAddress = request.billing_same_as_delivery === true
    ? deliveryAddress
    : normalizeAddress(request.billing_address)

  if (!idempotencyKey || !uuidPattern.test(idempotencyKey) || !customer || !email || !emailPattern.test(email) || !phone || !firstName || !lastName || !deliveryAddress || !billingAddress || !Array.isArray(request.lines) || request.lines.length === 0) return null

  const seenVariants = new Set<string>()
  const lines: Array<{ variant_id: string; quantity: number }> = []
  for (const value of request.lines) {
    const line = asObject(value)
    const variantId = normalizeRequired(line?.variant_id)
    const quantity = line?.quantity
    if (!variantId || !uuidPattern.test(variantId) || typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0 || seenVariants.has(variantId)) return null
    seenVariants.add(variantId)
    lines.push({ variant_id: variantId, quantity })
  }

  return {
    idempotency_key: idempotencyKey,
    customer: {
      email,
      phone,
      first_name: firstName,
      last_name: lastName,
      company: normalizeText(customer.company) ?? '',
    },
    delivery_address: deliveryAddress,
    billing_address: billingAddress,
    notes: normalizeText(request.notes) ?? '',
    lines: lines.sort((left, right) => left.variant_id.localeCompare(right.variant_id)),
  }
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

function rpcErrorResponse(message: string) {
  if (message === 'IDEMPOTENCY_CONFLICT') return errorResponse('This checkout attempt conflicts with an earlier request. Please review your cart and try again.', 409)
  if (['INVALID_CART_LINE', 'DUPLICATE_VARIANT_LINE', 'VARIANT_UNAVAILABLE', 'UNSUPPORTED_CURRENCY', 'MIXED_CURRENCY'].includes(message)) return errorResponse('One or more cart items are no longer available. Review your cart and try again.', 422)
  if (message === 'INVALID_CHECKOUT_REQUEST' || message === 'INVALID_IDEMPOTENCY_HASH') return errorResponse('The checkout request could not be validated.', 400)
  return errorResponse('Unable to create a draft order right now. Please try again.', 500)
}

export default {
  fetch: withSupabase({ auth: 'publishable' }, async (request, ctx) => {
    if (request.method !== 'POST') return errorResponse('Method not allowed.', 405)

    const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
    const { data: userData } = token ? await ctx.supabaseAdmin.auth.getUser(token) : { data: { user: null } }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return errorResponse('Request body must be valid JSON.', 400)
    }

    const normalizedRequest = normalizeCheckoutRequest(body)
    if (!normalizedRequest) return errorResponse('The checkout request is invalid.', 400)

    const payload: NormalizedCheckoutPayload = {
      ...normalizedRequest,
      idempotency_hash: await sha256Hex(JSON.stringify(normalizedRequest)),
    }
    const { data, error } = await ctx.supabaseAdmin.rpc('create_order_draft', { p_payload: payload })
    if (error) return rpcErrorResponse(error.message)

    const order = data?.[0]
    if (!order) return errorResponse('Unable to create a draft order right now. Please try again.', 500)

    if (userData.user) {
      const { error: ownershipError } = await ctx.supabaseAdmin.from('orders').update({ user_id: userData.user.id }).eq('id', order.order_id)
      if (ownershipError) return errorResponse('Unable to create a draft order right now. Please try again.', 500)
    }

    return Response.json(order, { status: order.reused_existing_order ? 200 : 201 })
  }),
}
