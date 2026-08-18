-- Separates existing-order lookup state from new-order calculation state.
create or replace function public.create_order_draft(p_payload jsonb)
returns table (
  order_id uuid,
  order_number bigint,
  order_status text,
  payment_status text,
  subtotal_minor integer,
  currency text,
  reused_existing_order boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_idempotency_key uuid;
  v_idempotency_hash text;
  v_customer jsonb;
  v_delivery_address jsonb;
  v_billing_address jsonb;
  v_lines jsonb;
  v_line record;
  v_variant_id uuid;
  v_quantity integer;
  v_order_id uuid;
  v_order_number bigint;
  v_order_status text;
  v_payment_status text;
  v_subtotal_minor integer := 0;
  v_order_currency text;
  v_currency text;
  v_existing_order_id uuid;
  v_existing_order_number bigint;
  v_existing_order_status text;
  v_existing_payment_status text;
  v_existing_subtotal_minor integer;
  v_existing_currency text;
  v_existing_idempotency_hash text;
  v_product_id uuid;
  v_product_name text;
  v_product_slug text;
  v_product_code text;
  v_variant_label text;
  v_sku text;
  v_unit_price_minor integer;
  v_image_path text;
  v_email text;
  v_phone text;
  v_first_name text;
  v_last_name text;
  v_company text;
  v_notes text;
begin
  if p_payload is null or pg_catalog.jsonb_typeof(p_payload) <> 'object' then
    raise exception using errcode = 'P0001', message = 'INVALID_CHECKOUT_REQUEST';
  end if;

  v_idempotency_key := (p_payload ->> 'idempotency_key')::uuid;
  v_idempotency_hash := p_payload ->> 'idempotency_hash';
  if v_idempotency_hash is null or v_idempotency_hash !~ '^[0-9a-f]{64}$' then
    raise exception using errcode = 'P0001', message = 'INVALID_IDEMPOTENCY_HASH';
  end if;

  v_customer := p_payload -> 'customer';
  v_delivery_address := p_payload -> 'delivery_address';
  v_billing_address := p_payload -> 'billing_address';
  v_lines := p_payload -> 'lines';
  if pg_catalog.jsonb_typeof(v_customer) <> 'object'
    or pg_catalog.jsonb_typeof(v_delivery_address) <> 'object'
    or pg_catalog.jsonb_typeof(v_billing_address) <> 'object'
    or pg_catalog.jsonb_typeof(v_lines) <> 'array'
    or pg_catalog.jsonb_array_length(v_lines) = 0 then
    raise exception using errcode = 'P0001', message = 'INVALID_CHECKOUT_REQUEST';
  end if;

  v_email := nullif(pg_catalog.btrim(v_customer ->> 'email'), '');
  v_phone := nullif(pg_catalog.btrim(v_customer ->> 'phone'), '');
  v_first_name := nullif(pg_catalog.btrim(v_customer ->> 'first_name'), '');
  v_last_name := nullif(pg_catalog.btrim(v_customer ->> 'last_name'), '');
  v_company := nullif(pg_catalog.btrim(v_customer ->> 'company'), '');
  v_notes := nullif(pg_catalog.btrim(p_payload ->> 'notes'), '');
  if v_email is null or v_phone is null or v_first_name is null or v_last_name is null then
    raise exception using errcode = 'P0001', message = 'INVALID_CHECKOUT_REQUEST';
  end if;

  if nullif(pg_catalog.btrim(v_delivery_address ->> 'address_line_1'), '') is null
    or nullif(pg_catalog.btrim(v_delivery_address ->> 'city'), '') is null
    or nullif(pg_catalog.btrim(v_delivery_address ->> 'postcode'), '') is null
    or nullif(pg_catalog.btrim(v_delivery_address ->> 'country'), '') is null
    or nullif(pg_catalog.btrim(v_billing_address ->> 'address_line_1'), '') is null
    or nullif(pg_catalog.btrim(v_billing_address ->> 'city'), '') is null
    or nullif(pg_catalog.btrim(v_billing_address ->> 'postcode'), '') is null
    or nullif(pg_catalog.btrim(v_billing_address ->> 'country'), '') is null then
    raise exception using errcode = 'P0001', message = 'INVALID_CHECKOUT_REQUEST';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_idempotency_key::text, 0));

  select o.id, o.order_number, o.order_status, o.payment_status, o.subtotal_minor, o.currency, o.idempotency_hash
  into v_existing_order_id, v_existing_order_number, v_existing_order_status, v_existing_payment_status, v_existing_subtotal_minor, v_existing_currency, v_existing_idempotency_hash
  from public.orders as o
  where o.idempotency_key = v_idempotency_key;

  if found then
    if v_existing_idempotency_hash <> v_idempotency_hash then
      raise exception using errcode = 'P0001', message = 'IDEMPOTENCY_CONFLICT';
    end if;

    return query select v_existing_order_id, v_existing_order_number, v_existing_order_status, v_existing_payment_status, v_existing_subtotal_minor, v_existing_currency, true;
    return;
  end if;

  if exists (
    select 1
    from (
      select (line.value ->> 'variant_id') as variant_id
      from pg_catalog.jsonb_array_elements(v_lines) as line(value)
    ) as requested_lines
    group by requested_lines.variant_id
    having pg_catalog.count(*) > 1
  ) then
    raise exception using errcode = 'P0001', message = 'DUPLICATE_VARIANT_LINE';
  end if;

  v_subtotal_minor := 0;
  v_order_currency := null;
  v_currency := null;

  for v_line in
    select line.variant_id, line.quantity
    from pg_catalog.jsonb_to_recordset(v_lines) as line(variant_id uuid, quantity integer)
  loop
    v_variant_id := v_line.variant_id;
    v_quantity := v_line.quantity;
    if v_variant_id is null or v_quantity is null or v_quantity <= 0 then
      raise exception using errcode = 'P0001', message = 'INVALID_CART_LINE';
    end if;

    select v.product_id, p.name, p.slug, p.code, v.label, v.sku, v.price_minor, v.currency
    into v_product_id, v_product_name, v_product_slug, v_product_code, v_variant_label, v_sku, v_unit_price_minor, v_currency
    from public.product_variants as v
    join public.products as p on p.id = v.product_id
    where v.id = v_variant_id
      and v.is_active
      and p.is_active
      and v.is_in_stock
      and (v.stock_quantity is null or v.stock_quantity >= v_quantity)
    for share of v, p;

    if not found then
      raise exception using errcode = 'P0001', message = 'VARIANT_UNAVAILABLE';
    end if;

    if v_order_currency is null then
      v_order_currency := v_currency;
    elsif v_order_currency <> v_currency then
      raise exception using errcode = 'P0001', message = 'MIXED_CURRENCY';
    end if;

    if v_currency <> 'GBP' then
      raise exception using errcode = 'P0001', message = 'UNSUPPORTED_CURRENCY';
    end if;

    v_subtotal_minor := v_subtotal_minor + (v_unit_price_minor * v_quantity);
  end loop;

  v_currency := v_order_currency;

  begin
    insert into public.orders as inserted_order (
      idempotency_key,
      idempotency_hash,
      email,
      phone,
      currency,
      subtotal_minor,
      shipping_minor,
      tax_minor,
      total_minor,
      order_status,
      payment_status,
      fulfillment_status,
      notes
    ) values (
      v_idempotency_key,
      v_idempotency_hash,
      v_email,
      v_phone,
      v_currency,
      v_subtotal_minor,
      null,
      null,
      null,
      'draft',
      'unpaid',
      'unfulfilled',
      v_notes
    ) returning
      inserted_order.id,
      inserted_order.order_number,
      inserted_order.order_status,
      inserted_order.payment_status,
      inserted_order.subtotal_minor,
      inserted_order.currency
    into v_order_id, v_order_number, v_order_status, v_payment_status, v_subtotal_minor, v_currency;
  exception when unique_violation then
    select o.id, o.order_number, o.order_status, o.payment_status, o.subtotal_minor, o.currency, o.idempotency_hash
    into v_existing_order_id, v_existing_order_number, v_existing_order_status, v_existing_payment_status, v_existing_subtotal_minor, v_existing_currency, v_existing_idempotency_hash
    from public.orders as o
    where o.idempotency_key = v_idempotency_key;

    if not found then
      raise;
    elsif v_existing_idempotency_hash <> v_idempotency_hash then
      raise exception using errcode = 'P0001', message = 'IDEMPOTENCY_CONFLICT';
    end if;

    return query select v_existing_order_id, v_existing_order_number, v_existing_order_status, v_existing_payment_status, v_existing_subtotal_minor, v_existing_currency, true;
    return;
  end;

  for v_line in
    select line.variant_id, line.quantity
    from pg_catalog.jsonb_to_recordset(v_lines) as line(variant_id uuid, quantity integer)
  loop
    v_variant_id := v_line.variant_id;
    v_quantity := v_line.quantity;

    select v.product_id, p.name, p.slug, p.code, v.label, v.sku, v.price_minor, v.currency
    into v_product_id, v_product_name, v_product_slug, v_product_code, v_variant_label, v_sku, v_unit_price_minor, v_currency
    from public.product_variants as v
    join public.products as p on p.id = v.product_id
    where v.id = v_variant_id
      and v.is_active
      and p.is_active
      and v.is_in_stock
      and (v.stock_quantity is null or v.stock_quantity >= v_quantity)
    for share of v, p;

    if not found then
      raise exception using errcode = 'P0001', message = 'VARIANT_UNAVAILABLE';
    end if;

    v_image_path := null;
    select pi.storage_path
    into v_image_path
    from public.product_images as pi
    where pi.product_id = v_product_id
      and (pi.variant_id is null or pi.variant_id = v_variant_id)
    order by (pi.variant_id = v_variant_id) desc, pi.is_primary desc, pi.sort_order, pi.id
    limit 1;

    insert into public.order_items (
      order_id,
      product_id,
      variant_id,
      product_name,
      product_slug,
      product_code,
      variant_label,
      sku,
      image_path,
      unit_price_minor,
      quantity,
      line_total_minor,
      currency
    ) values (
      v_order_id,
      v_product_id,
      v_variant_id,
      v_product_name,
      v_product_slug,
      v_product_code,
      v_variant_label,
      v_sku,
      v_image_path,
      v_unit_price_minor,
      v_quantity,
      v_unit_price_minor * v_quantity,
      v_currency
    );
  end loop;

  insert into public.order_addresses (
    order_id, address_type, first_name, last_name, company, address_line_1, address_line_2, city, region, postcode, country
  ) values
    (
      v_order_id, 'delivery', v_first_name, v_last_name, v_company,
      pg_catalog.btrim(v_delivery_address ->> 'address_line_1'), nullif(pg_catalog.btrim(v_delivery_address ->> 'address_line_2'), ''),
      pg_catalog.btrim(v_delivery_address ->> 'city'), nullif(pg_catalog.btrim(v_delivery_address ->> 'region'), ''),
      pg_catalog.btrim(v_delivery_address ->> 'postcode'), pg_catalog.btrim(v_delivery_address ->> 'country')
    ),
    (
      v_order_id, 'billing', v_first_name, v_last_name, v_company,
      pg_catalog.btrim(v_billing_address ->> 'address_line_1'), nullif(pg_catalog.btrim(v_billing_address ->> 'address_line_2'), ''),
      pg_catalog.btrim(v_billing_address ->> 'city'), nullif(pg_catalog.btrim(v_billing_address ->> 'region'), ''),
      pg_catalog.btrim(v_billing_address ->> 'postcode'), pg_catalog.btrim(v_billing_address ->> 'country')
    );

  return query select v_order_id, v_order_number, v_order_status, v_payment_status, v_subtotal_minor, v_currency, false;
end;
$$;



revoke all on function public.create_order_draft(jsonb) from public, anon, authenticated;

grant execute on function public.create_order_draft(jsonb) to service_role;

