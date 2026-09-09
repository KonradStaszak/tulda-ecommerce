create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  request_number bigint generated always as identity unique,
  idempotency_key uuid not null unique,
  first_name text not null,
  last_name text not null,
  company text,
  email text not null,
  phone text not null,
  notes text,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'closed', 'cancelled')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.quote_request_items (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references public.quote_requests(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  product_code text,
  variant_label text not null,
  quantity integer not null check (quantity > 0)
);
create trigger set_quote_requests_updated_at before update on public.quote_requests for each row execute function public.set_updated_at();
create index idx_quote_requests_created_at on public.quote_requests(created_at desc);
create index idx_quote_request_items_request on public.quote_request_items(quote_request_id);
alter table public.quote_requests enable row level security;
alter table public.quote_request_items enable row level security;
create policy "Administrators can manage quote requests" on public.quote_requests for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Administrators can manage quote request items" on public.quote_request_items for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select, update on public.quote_requests to authenticated;
grant select on public.quote_request_items to authenticated;
grant select, insert, update on public.quote_requests, public.quote_request_items to service_role;
