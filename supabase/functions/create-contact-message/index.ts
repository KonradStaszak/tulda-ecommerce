import { withSupabase } from 'npm:@supabase/server@^1'

const text = (value: unknown) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
const messageText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default { fetch: withSupabase({ auth: 'publishable' }, async (request, ctx) => {
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed.' }, { status: 405 })
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
  const { data: userData } = token ? await ctx.supabaseAdmin.auth.getUser(token) : { data: { user: null } }
  let body: any
  try { body = await request.json() } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }) }

  const fullName = text(body?.full_name)
  const company = text(body?.company)
  const customerEmail = text(body?.email).toLowerCase()
  const phone = text(body?.phone)
  const message = messageText(body?.message)
  if (!uuid.test(text(body?.idempotency_key)) || !fullName || fullName.length > 120 || !email.test(customerEmail) || customerEmail.length > 254 || !message || message.length > 5000 || company.length > 160 || phone.length > 50) return Response.json({ error: 'Invalid contact message.' }, { status: 400 })

  const { data: existing } = await ctx.supabaseAdmin.from('contact_messages').select('message_number').eq('idempotency_key', body.idempotency_key).maybeSingle()
  if (existing) return Response.json(existing)

  const { data, error } = await ctx.supabaseAdmin.from('contact_messages').insert({
    idempotency_key: body.idempotency_key,
    user_id: userData.user?.id ?? null,
    full_name: fullName,
    company: company || null,
    email: customerEmail,
    phone: phone || null,
    message,
  }).select('message_number').single()
  if (error || !data) return Response.json({ error: 'Unable to save contact message.' }, { status: 500 })
  return Response.json(data, { status: 201 })
}) }
