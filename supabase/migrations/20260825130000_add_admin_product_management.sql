-- Administrative access is stored separately from customer profile data so that
-- all product mutations remain protected by row-level security.
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "Administrators can view their own role"
on public.admin_users for select to authenticated
using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
grant select on public.admin_users to authenticated;

create policy "Administrators can manage categories"
on public.categories for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Administrators can manage products"
on public.products for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Administrators can manage product categories"
on public.product_categories for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Administrators can manage product variants"
on public.product_variants for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Administrators can manage product images"
on public.product_images for all to authenticated
using (public.is_admin()) with check (public.is_admin());

grant select, insert, update, delete on public.categories, public.products,
  public.product_categories, public.product_variants, public.product_images
to authenticated;

-- Development/staging account. Change or remove this user before deploying to production.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
values (
  '00000000-0000-0000-0000-000000000000',
  'f0af7023-6b8b-4f01-a4e0-5e673b94793f',
  'authenticated', 'authenticated', 'admin@tulda.test',
  extensions.crypt('TuldaAdmin!2026', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Tulda Administrator"}',
  now(), now(), '', '', '', ''
)
on conflict (id) do nothing;

insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
values (
  'f0af7023-6b8b-4f01-a4e0-5e673b94793f',
  'f0af7023-6b8b-4f01-a4e0-5e673b94793f',
  '{"sub":"f0af7023-6b8b-4f01-a4e0-5e673b94793f","email":"admin@tulda.test"}',
  'email', 'admin@tulda.test', now(), now(), now()
)
on conflict (provider, provider_id) do nothing;

insert into public.admin_users (user_id)
values ('f0af7023-6b8b-4f01-a4e0-5e673b94793f')
on conflict (user_id) do nothing;
