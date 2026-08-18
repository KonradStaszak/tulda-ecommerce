grant usage on schema public to service_role;

grant select, insert, update on table public.categories,
  public.products,
  public.product_categories,
  public.product_variants,
  public.product_images
to service_role;
