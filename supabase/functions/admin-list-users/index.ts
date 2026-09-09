import { withSupabase } from 'npm:@supabase/server@^1'

export default {
  fetch: withSupabase({ auth: 'publishable' }, async (request, ctx) => {
    const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
    if (!token) return Response.json({ error: 'Unauthorized.' }, { status: 401 })

    const { data: currentUser } = await ctx.supabaseAdmin.auth.getUser(token)
    if (!currentUser.user) return Response.json({ error: 'Unauthorized.' }, { status: 401 })

    const { data: membership } = await ctx.supabaseAdmin.from('admin_users').select('user_id').eq('user_id', currentUser.user.id).maybeSingle()
    if (!membership) return Response.json({ error: 'Forbidden.' }, { status: 403 })

    const { data, error } = await ctx.supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 100 })
    if (error) return Response.json({ error: 'Unable to load users.' }, { status: 500 })

    const adminIds = new Set((await ctx.supabaseAdmin.from('admin_users').select('user_id')).data?.map((item) => item.user_id) ?? [])
    return Response.json(data.users.map((user) => ({
      id: user.id,
      email: user.email ?? null,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at ?? null,
      full_name: typeof user.user_metadata.full_name === 'string' ? user.user_metadata.full_name : null,
      is_admin: adminIds.has(user.id),
    })))
  }),
}
