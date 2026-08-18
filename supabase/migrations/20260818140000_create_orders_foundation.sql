create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  idempotency_key uuid not null unique,
  idempotency_hash text not null,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  phone text not null,
  currency text not null default 'GBP',
  subtotal_minor integer not null,
  shipping_minor integer,
  tax_minor integer,
  total_minor integer,
  order_status text not null default 'draft',
  payment_status text not null default 'unpaid',
  fulfillment_status text not null default 'unfulfilled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_idempotency_hash_sha256 check (idempotency_hash ~ '^[0-9a-f]{64}$'),
  constraint orders_currency_present check (nullif(btrim(currency), '') is not null),
  constraint orders_subtotal_minor_non_negative check (subtotal_minor >= 0),
  constraint orders_shipping_minor_non_negative check (shipping_minor is null or shipping_minor >= 0),
  constraint orders_tax_minor_non_negative check (tax_minor is null or tax_minor >= 0),
  constraint orders_total_minor_non_negative check (total_minor is null or total_minor >= 0),
  constraint orders_order_status_valid check (order_status in ('draft', 'pending_payment', 'confirmed', 'cancelled', 'failed')),
  constraint orders_payment_status_valid check (payment_status in ('unpaid', 'pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
  constraint orders_fulfillment_status_valid check (fulfillment_status in ('unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled'))
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  product_slug text,
  product_code text,
  variant_label text not null,
  sku text,
  image_path text,
  unit_price_minor integer not null,
  quantity integer not null,
  line_total_minor integer not null,
  currency text not null,
  created_at timestamptz not null default now(),
  constraint order_items_currency_present check (nullif(btrim(currency), '') is not null),
  constraint order_items_quantity_positive check (quantity > 0),
  constraint order_items_unit_price_minor_non_negative check (unit_price_minor >= 0),
  constraint order_items_line_total_minor_non_negative check (line_total_minor >= 0),
  constraint order_items_line_total_matches_unit_price check (line_total_minor = unit_price_minor * quantity)
);

create table public.order_addresses (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  address_type text not null,
  first_name text not null,
  last_name text not null,
  company text,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  region text,
  postcode text not null,
  country text not null,
  created_at timestamptz not null default now(),
  constraint order_addresses_type_valid check (address_type in ('delivery', 'billing')),
  constraint order_addresses_order_type_unique unique (order_id, address_type)
);

create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

create index idx_orders_created_at on public.orders (created_at desc);
create index idx_orders_email on public.orders (email);
create index idx_orders_order_status on public.orders (order_status);
create index idx_orders_payment_status on public.orders (payment_status);
create index idx_orders_user_id on public.orders (user_id) where user_id is not null;
create index idx_order_items_order_id on public.order_items (order_id);
create index idx_order_items_product_id on public.order_items (product_id) where product_id is not null;
create index idx_order_items_variant_id on public.order_items (variant_id) where variant_id is not null;
create index idx_order_addresses_order_id on public.order_addresses (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_addresses enable row level security;

revoke all on table public.orders, public.order_items, public.order_addresses
from public, anon, authenticated;

grant usage on schema public to service_role;

grant select, insert, update on table public.orders, public.order_items, public.order_addresses
to service_role;
