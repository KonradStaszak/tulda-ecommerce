alter table public.categories
  add column woocommerce_id bigint,
  add constraint categories_woocommerce_id_unique unique (woocommerce_id);

alter table public.products
  add column woocommerce_id bigint,
  add constraint products_woocommerce_id_unique unique (woocommerce_id);

alter table public.product_variants
  add column woocommerce_id bigint,
  add constraint product_variants_woocommerce_id_unique unique (woocommerce_id);
