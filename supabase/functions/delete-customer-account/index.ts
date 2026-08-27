import { withSupabase } from 'npm:@supabase/server@^1'

export default {
  fetch: withSupabase({ auth: 'publishable' }, async (request, ctx) => {
    if (request.method !== 'POST') return Response.json({ error: 'Method not allowed.' }, { status: 405 })
    const authorization = request.headers.get('Authorization')
    const token = authorization?.replace(/^Bearer\s+/i, '')
    if (!token) return Response.json({ error: 'Authentication is required.' }, { status: 401 })

    const { data, error } = await ctx.supabaseAdmin.auth.getUser(token)
    if (error || !data.user) return Response.json({ error: 'Authentication is required.' }, { status: 401 })

    const { error: deletionError } = await ctx.supabaseAdmin.auth.admin.deleteUser(data.user.id)
    if (deletionError) return Response.json({ error: 'Unable to delete the account.' }, { status: 500 })
    return Response.json({ deleted: true })
  }),
}
