import { withSupabase } from 'npm:@supabase/server@^1'

const text = (value: unknown) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default { fetch: withSupabase({ auth: 'publishable' }, async (request, ctx) => {
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed.' }, { status: 405 })
  let body: any
  try { body = await request.json() } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }) }
  const customer = body?.customer ?? {}; const lines = body?.lines
  const firstName = text(customer.firstName); const lastName = text(customer.lastName); const customerEmail = text(customer.email).toLowerCase(); const phone = text(customer.phone)
  if (!uuid.test(text(body?.idempotency_key)) || !firstName || !lastName || !phone || !email.test(customerEmail) || !Array.isArray(lines) || !lines.length) return Response.json({ error: 'Invalid request.' }, { status: 400 })
  const ids = [...new Set(lines.map((line: any) => text(line?.variant_id)))]
  if (ids.length !== lines.length || ids.some((id) => !uuid.test(id)) || lines.some((line: any) => !Number.isInteger(line.quantity) || line.quantity < 1)) return Response.json({ error: 'Invalid products.' }, { status: 400 })
  const { data: variants, error } = await ctx.supabaseAdmin.from('product_variants').select('id,label,product_id,products!inner(name,code,is_active)').in('id', ids).eq('is_active', true)
  if (error || !variants || variants.length !== ids.length) return Response.json({ error: 'A selected product is no longer available.' }, { status: 422 })
  const { data: existing } = await ctx.supabaseAdmin.from('quote_requests').select('request_number').eq('idempotency_key', body.idempotency_key).maybeSingle()
  if (existing) return Response.json(existing)
  const { data: quote, error: quoteError } = await ctx.supabaseAdmin.from('quote_requests').insert({ idempotency_key: body.idempotency_key, first_name: firstName, last_name: lastName, company: text(customer.company) || null, email: customerEmail, phone, notes: text(customer.notes) || null }).select('id,request_number').single()
  if (quoteError || !quote) return Response.json({ error: 'Unable to save enquiry.' }, { status: 500 })
  const lookup = new Map(variants.map((variant: any) => [variant.id, variant]))
  const { error: itemsError } = await ctx.supabaseAdmin.from('quote_request_items').insert(lines.map((line: any) => { const variant: any = lookup.get(line.variant_id); return { quote_request_id: quote.id, product_id: variant.product_id, variant_id: variant.id, product_name: variant.products.name, product_code: variant.products.code, variant_label: variant.label, quantity: line.quantity } }))
  if (itemsError) { await ctx.supabaseAdmin.from('quote_requests').delete().eq('id', quote.id); return Response.json({ error: 'Unable to save enquiry.' }, { status: 500 }) }
  return Response.json({ request_number: quote.request_number })
}) }
