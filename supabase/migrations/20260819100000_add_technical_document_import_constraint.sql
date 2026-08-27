-- A local document path is the stable identity for an imported product document.
-- This makes the import repeatable without changing public read access or RLS policies.
alter table public.technical_documents
  add constraint technical_documents_product_storage_path_key
  unique (product_id, storage_path);

grant usage on schema public to service_role;
grant select, insert, update on public.technical_documents to service_role;
