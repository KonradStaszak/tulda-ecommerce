create table public.customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  company text,
  address_line_1 text,
  address_line_2 text,
  city text,
  region text,
  postcode text,
  country text,
  updated_at timestamptz not null default now()
);

create table public.customer_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create trigger set_customer_profiles_updated_at
before update on public.customer_profiles
for each row execute function public.set_updated_at();

create index idx_customer_favorites_user_id on public.customer_favorites(user_id, created_at desc);

alter table public.customer_profiles enable row level security;
alter table public.customer_favorites enable row level security;

create policy "Customers can manage their profile"
on public.customer_profiles for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Customers can manage their favorites"
on public.customer_favorites for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Customers can view their orders"
on public.orders for select to authenticated
using (user_id = auth.uid());

grant select, insert, update on public.customer_profiles to authenticated;
grant select, insert, delete on public.customer_favorites to authenticated;
grant select on public.orders to authenticated;
