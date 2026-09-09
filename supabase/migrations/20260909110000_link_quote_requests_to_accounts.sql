alter table public.quote_requests
  add column user_id uuid references auth.users(id) on delete set null;

create index idx_quote_requests_user_id
  on public.quote_requests(user_id)
  where user_id is not null;

-- Link historical enquiries to the account that used the same sign-in email.
update public.quote_requests as quote_request
set user_id = account.id
from auth.users as account
where quote_request.user_id is null
  and lower(quote_request.email) = lower(account.email);

create policy "Customers can view their own quote requests"
on public.quote_requests
for select
to authenticated
using (user_id = auth.uid());

create policy "Customers can view their own quote request items"
on public.quote_request_items
for select
to authenticated
using (
  exists (
    select 1
    from public.quote_requests as quote_request
    where quote_request.id = quote_request_items.quote_request_id
      and quote_request.user_id = auth.uid()
  )
);
