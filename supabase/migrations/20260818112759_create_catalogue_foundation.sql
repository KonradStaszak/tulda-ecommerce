create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  parent_id uuid references public.categories(id),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  code text,
  name text not null,
  short_description text,
  description text,
  brand text not null default 'Tulda',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_categories (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique,
  label text not null,
  price_minor integer not null,
  currency text not null default 'GBP',
  stock_quantity integer,
  is_in_stock boolean not null default true,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variants_id_product_id_unique unique (id, product_id),
  constraint product_variants_price_minor_non_negative check (price_minor >= 0),
  constraint product_variants_stock_quantity_non_negative check (
    stock_quantity is null or stock_quantity >= 0
  ),
  constraint product_variants_stock_availability_consistent check (
    stock_quantity is null
    or (stock_quantity = 0 and not is_in_stock)
    or (stock_quantity > 0 and is_in_stock)
  )
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  constraint product_images_variant_product_fk
    foreign key (variant_id, product_id)
    references public.product_variants (id, product_id)
    on delete cascade
);

create table public.technical_documents (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  title text not null,
  document_type text not null,
  storage_path text,
  external_url text,
  version text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  constraint technical_documents_location_present check (
    nullif(btrim(storage_path), '') is not null
    or nullif(btrim(external_url), '') is not null
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create trigger set_product_variants_updated_at
before update on public.product_variants
for each row
execute function public.set_updated_at();

create index idx_categories_parent_active_sort_order
on public.categories (parent_id, sort_order)
where is_active;

create index idx_products_active
on public.products (created_at desc)
where is_active;

create index idx_products_featured_active
on public.products (created_at desc)
where is_active and is_featured;

create index idx_product_categories_category_product
on public.product_categories (category_id, product_id);

create index idx_product_variants_product_active_sort_order
on public.product_variants (product_id, sort_order)
where is_active;

create index idx_product_images_product_sort_order
on public.product_images (product_id, sort_order);

create index idx_technical_documents_product_published_at
on public.technical_documents (product_id, published_at desc nulls last);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_categories enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.technical_documents enable row level security;

create policy "Public can read active categories"
on public.categories
for select
to anon, authenticated
using (is_active);

create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (is_active);

create policy "Public can read active product categories"
on public.product_categories
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    join public.categories on categories.id = product_categories.category_id
    where products.id = product_categories.product_id
      and products.is_active
      and categories.is_active
  )
);

create policy "Public can read active product variants"
on public.product_variants
for select
to anon, authenticated
using (
  is_active
  and exists (
    select 1
    from public.products
    where products.id = product_variants.product_id
      and products.is_active
  )
);

create policy "Public can read images for active products"
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.is_active
  )
);

create policy "Public can read global or active product documents"
on public.technical_documents
for select
to anon, authenticated
using (
  product_id is null
  or exists (
    select 1
    from public.products
    where products.id = technical_documents.product_id
      and products.is_active
  )
);

revoke all on table public.categories, public.products, public.product_categories,
  public.product_variants, public.product_images, public.technical_documents
from public, anon, authenticated;

revoke all on function public.set_updated_at() from public, anon, authenticated;

grant usage on schema public to anon, authenticated;

grant select on table public.categories, public.products, public.product_categories,
  public.product_variants, public.product_images, public.technical_documents
to anon, authenticated;
