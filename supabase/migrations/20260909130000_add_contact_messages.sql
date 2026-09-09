create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  message_number bigint generated always as identity unique,
  idempotency_key uuid not null unique,
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  company text,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'resolved', 'closed')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_contact_messages_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

create index idx_contact_messages_created_at
  on public.contact_messages(created_at desc);

create index idx_contact_messages_user_id
  on public.contact_messages(user_id)
  where user_id is not null;

alter table public.contact_messages enable row level security;

create policy "Administrators can manage contact messages"
on public.contact_messages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select, update on public.contact_messages to authenticated;
grant select, insert, update on public.contact_messages to service_role;
