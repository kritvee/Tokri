begin;

create extension if not exists pgcrypto;

create table public.display_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  join_code_hash text not null unique,
  status text not null default 'active' check (status in ('active', 'closed')),
  expires_at timestamptz not null,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  check (
    (status = 'active' and closed_at is null)
    or (status = 'closed' and closed_at is not null)
  )
);

create table public.session_members (
  session_id uuid not null references public.display_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('controller', 'display')),
  created_at timestamptz not null default now(),
  primary key (session_id, user_id)
);

create unique index session_members_one_controller
  on public.session_members (session_id)
  where role = 'controller';

create unique index session_members_one_display_session_per_user
  on public.session_members (user_id)
  where role = 'display';

create table public.baskets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.display_sessions(id) on delete cascade,
  color text not null check (color in ('blue', 'red', 'green', 'yellow', 'orange', 'purple', 'pink')),
  running_total numeric(12, 2) not null default 0,
  updated_at timestamptz not null default now(),
  unique (session_id, color)
);

create table public.basket_items (
  id uuid primary key default gen_random_uuid(),
  basket_id uuid not null references public.baskets(id) on delete cascade,
  produce_name text not null check (length(trim(produce_name)) > 0),
  weight_kg numeric(10, 3) not null check (weight_kg > 0),
  rate_per_kg numeric(10, 2) not null check (rate_per_kg >= 0),
  item_price numeric(12, 2) generated always as (
    round(weight_kg * rate_per_kg, 2)
  ) stored,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.join_attempts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  failed_count integer not null default 0 check (failed_count >= 0),
  window_started_at timestamptz not null default now(),
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.display_sessions owner to postgres;
alter table public.session_members owner to postgres;
alter table public.baskets owner to postgres;
alter table public.basket_items owner to postgres;
alter table public.join_attempts owner to postgres;

create or replace function public.create_display_session(
  p_ttl interval default interval '8 hours'
)
returns table (
  session_id uuid,
  join_code text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  generated_code text;
  created_session_id uuid;
  created_expiry timestamptz;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_ttl < interval '15 minutes' or p_ttl > interval '7 days' then
    raise exception 'Session lifetime must be between 15 minutes and 7 days';
  end if;

  generated_code := upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 10));
  created_expiry := now() + p_ttl;

  insert into public.display_sessions (
    owner_id,
    join_code_hash,
    expires_at
  )
  values (
    current_user_id,
    encode(digest(generated_code, 'sha256'), 'hex'),
    created_expiry
  )
  returning id into created_session_id;

  insert into public.session_members (session_id, user_id, role)
  values (created_session_id, current_user_id, 'controller');

  insert into public.baskets (session_id, color)
  values
    (created_session_id, 'blue'),
    (created_session_id, 'red'),
    (created_session_id, 'green'),
    (created_session_id, 'yellow'),
    (created_session_id, 'orange'),
    (created_session_id, 'purple');

  -- The plaintext bearer code is returned once and is never stored.
  return query
  select created_session_id, generated_code, created_expiry;
end;
$$;

create or replace function public.protect_basket_item_update()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if TG_OP <> 'UPDATE' then
    raise exception 'protect_basket_item_update only supports UPDATE';
  end if;

  if new.basket_id <> old.basket_id then
    raise exception 'An item cannot be moved to another basket';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

create trigger protect_basket_item_before_update
before update on public.basket_items
for each row
execute function public.protect_basket_item_update();

create or replace function public.refresh_affected_basket_totals()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if TG_OP = 'INSERT' then
    update public.baskets as basket
    set
      running_total = coalesce((
        select sum(item.item_price)
        from public.basket_items as item
        where item.basket_id = basket.id
      ), 0),
      updated_at = now()
    where basket.id in (select distinct basket_id from new_rows);

  elsif TG_OP = 'UPDATE' then
    update public.baskets as basket
    set
      running_total = coalesce((
        select sum(item.item_price)
        from public.basket_items as item
        where item.basket_id = basket.id
      ), 0),
      updated_at = now()
    where basket.id in (
      select basket_id from old_rows
      union
      select basket_id from new_rows
    );

  elsif TG_OP = 'DELETE' then
    update public.baskets as basket
    set
      running_total = coalesce((
        select sum(item.item_price)
        from public.basket_items as item
        where item.basket_id = basket.id
      ), 0),
      updated_at = now()
    where basket.id in (select distinct basket_id from old_rows);

  else
    raise exception 'Unsupported trigger operation: %', TG_OP;
  end if;

  return null;
end;
$$;

create trigger refresh_basket_totals_after_insert
after insert on public.basket_items
referencing new table as new_rows
for each statement
execute function public.refresh_affected_basket_totals();

create trigger refresh_basket_totals_after_update
after update on public.basket_items
referencing old table as old_rows new table as new_rows
for each statement
execute function public.refresh_affected_basket_totals();

create trigger refresh_basket_totals_after_delete
after delete on public.basket_items
referencing old table as old_rows
for each statement
execute function public.refresh_affected_basket_totals();

create or replace function public.join_display_session(p_join_code text)
returns table (
  joined_session_id uuid,
  status text,
  retry_after_seconds integer
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  attempt_record public.join_attempts%rowtype;
  matched_session_id uuid;
  next_failed_count integer;
  remaining_lock_seconds integer;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  insert into public.join_attempts (user_id)
  values (current_user_id)
  on conflict (user_id) do nothing;

  select * into attempt_record
  from public.join_attempts
  where user_id = current_user_id
  for update;

  if attempt_record.locked_until is not null
     and attempt_record.locked_until > now() then
    remaining_lock_seconds := greatest(
      1,
      ceil(extract(epoch from (attempt_record.locked_until - now())))::integer
    );

    return query select null::uuid, 'locked'::text, remaining_lock_seconds;
    return;
  end if;

  if (
    attempt_record.locked_until is not null
    and attempt_record.locked_until <= now()
  ) or (
    attempt_record.window_started_at <= now() - interval '10 minutes'
  ) then
    update public.join_attempts
    set failed_count = 0,
        window_started_at = now(),
        locked_until = null,
        updated_at = now()
    where user_id = current_user_id;

    attempt_record.failed_count := 0;
    attempt_record.window_started_at := now();
    attempt_record.locked_until := null;
  end if;

  select session.id into matched_session_id
  from public.display_sessions as session
  where session.join_code_hash = encode(
          digest(upper(trim(p_join_code)), 'sha256'),
          'hex'
        )
    and session.status = 'active'
    and session.expires_at > now()
  limit 1;

  if matched_session_id is null then
    next_failed_count := attempt_record.failed_count + 1;

    if next_failed_count >= 5 then
      update public.join_attempts
      set failed_count = next_failed_count,
          locked_until = now() + interval '15 minutes',
          updated_at = now()
      where user_id = current_user_id;

      return query select null::uuid, 'locked'::text, 900;
      return;
    end if;

    update public.join_attempts
    set failed_count = next_failed_count,
        updated_at = now()
    where user_id = current_user_id;

    return query select null::uuid, 'invalid_code'::text, 0;
    return;
  end if;

  if exists (
    select 1
    from public.session_members
    where session_id = matched_session_id
      and user_id = current_user_id
      and role = 'controller'
  ) then
    return query
    select
      null::uuid,
      'controller_cannot_join'::text,
      0;

    return;
  end if;

  -- One iPad identity can be joined to only one display session.
  delete from public.session_members
  where user_id = current_user_id
    and role = 'display';

  insert into public.session_members (session_id, user_id, role)
  values (matched_session_id, current_user_id, 'display')
  on conflict (session_id, user_id) do nothing;

  update public.join_attempts
  set failed_count = 0,
      window_started_at = now(),
      locked_until = null,
      updated_at = now()
  where user_id = current_user_id;

  return query select matched_session_id, 'joined'::text, 0;
end;
$$;

create or replace function public.clear_basket(p_basket_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1
    from public.baskets as basket
    join public.display_sessions as session on session.id = basket.session_id
    join public.session_members as membership on membership.session_id = session.id
    where basket.id = p_basket_id
      and membership.user_id = auth.uid()
      and membership.role = 'controller'
      and session.status = 'active'
      and session.expires_at > now()
  ) then
    raise exception 'Active controller access required';
  end if;

  -- The statement-level DELETE trigger recalculates only this basket once.
  delete from public.basket_items where basket_id = p_basket_id;
end;
$$;

create or replace function public.close_display_session(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1
    from public.session_members
    where session_id = p_session_id
      and user_id = auth.uid()
      and role = 'controller'
  ) then
    raise exception 'Controller access required';
  end if;

  update public.display_sessions
  set status = 'closed',
      closed_at = now()
  where id = p_session_id
    and status = 'active';

  -- Remove read access after the close event is published.
  delete from public.session_members
  where session_id = p_session_id
    and role = 'display';
end;
$$;


create or replace function public.is_active_session_member(
  p_session_id uuid,
  p_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.session_members as membership
    join public.display_sessions as session
      on session.id = membership.session_id
    where membership.session_id = p_session_id
      and membership.user_id = p_user_id
      and session.status = 'active'
      and session.expires_at > now()
  );
$$;

alter function public.create_display_session(interval) owner to postgres;
alter function public.protect_basket_item_update() owner to postgres;
alter function public.refresh_affected_basket_totals() owner to postgres;
alter function public.join_display_session(text) owner to postgres;
alter function public.clear_basket(uuid) owner to postgres;
alter function public.close_display_session(uuid) owner to postgres;
alter function public.is_active_session_member(uuid, uuid) owner to postgres;

revoke all on function public.create_display_session(interval) from public, anon, authenticated;
revoke all on function public.protect_basket_item_update() from public, anon, authenticated;
revoke all on function public.refresh_affected_basket_totals() from public, anon, authenticated;
revoke all on function public.join_display_session(text) from public, anon, authenticated;
revoke all on function public.clear_basket(uuid) from public, anon, authenticated;
revoke all on function public.close_display_session(uuid) from public, anon, authenticated;
revoke all on function public.is_active_session_member(uuid, uuid) from public, anon, authenticated;

grant execute on function public.create_display_session(interval) to authenticated;
grant execute on function public.join_display_session(text) to authenticated;
grant execute on function public.clear_basket(uuid) to authenticated;
grant execute on function public.close_display_session(uuid) to authenticated;
grant execute on function public.is_active_session_member(uuid, uuid) to authenticated;

alter table public.display_sessions enable row level security;
alter table public.session_members enable row level security;
alter table public.baskets enable row level security;
alter table public.basket_items enable row level security;
alter table public.join_attempts enable row level security;

create policy "Members can view permitted sessions"
on public.display_sessions
for select
to authenticated
using (
  public.is_active_session_member(display_sessions.id, auth.uid())
);

create policy "Users can view their own memberships"
on public.session_members
for select
to authenticated
using (
  user_id = auth.uid()
  and public.is_active_session_member(session_members.session_id, auth.uid())
);

create policy "Members can view permitted baskets"
on public.baskets
for select
to authenticated
using (
  exists (
    select 1
    from public.session_members as membership
    join public.display_sessions as session on session.id = membership.session_id
    where membership.session_id = baskets.session_id
      and membership.user_id = auth.uid()
      and session.status = 'active'
      and session.expires_at > now()
  )
);

create policy "Members can view permitted basket items"
on public.basket_items
for select
to authenticated
using (
  exists (
    select 1
    from public.baskets as basket
    join public.session_members as membership on membership.session_id = basket.session_id
    join public.display_sessions as session on session.id = basket.session_id
    where basket.id = basket_items.basket_id
      and membership.user_id = auth.uid()
      and session.status = 'active'
      and session.expires_at > now()
  )
);

create policy "Active controllers can add basket items"
on public.basket_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.baskets as basket
    join public.session_members as membership on membership.session_id = basket.session_id
    join public.display_sessions as session on session.id = basket.session_id
    where basket.id = basket_items.basket_id
      and membership.user_id = auth.uid()
      and membership.role = 'controller'
      and session.status = 'active'
      and session.expires_at > now()
  )
);

create policy "Active controllers can edit basket items"
on public.basket_items
for update
to authenticated
using (
  exists (
    select 1
    from public.baskets as basket
    join public.session_members as membership on membership.session_id = basket.session_id
    join public.display_sessions as session on session.id = basket.session_id
    where basket.id = basket_items.basket_id
      and membership.user_id = auth.uid()
      and membership.role = 'controller'
      and session.status = 'active'
      and session.expires_at > now()
  )
)
with check (
  exists (
    select 1
    from public.baskets as basket
    join public.session_members as membership on membership.session_id = basket.session_id
    join public.display_sessions as session on session.id = basket.session_id
    where basket.id = basket_items.basket_id
      and membership.user_id = auth.uid()
      and membership.role = 'controller'
      and session.status = 'active'
      and session.expires_at > now()
  )
);

create policy "Active controllers can delete basket items"
on public.basket_items
for delete
to authenticated
using (
  exists (
    select 1
    from public.baskets as basket
    join public.session_members as membership on membership.session_id = basket.session_id
    join public.display_sessions as session on session.id = basket.session_id
    where basket.id = basket_items.basket_id
      and membership.user_id = auth.uid()
      and membership.role = 'controller'
      and session.status = 'active'
      and session.expires_at > now()
  )
);

grant usage on schema public to authenticated;

revoke all on table public.display_sessions,
                    public.session_members,
                    public.baskets,
                    public.basket_items,
                    public.join_attempts
from public, anon, authenticated;

grant select on table public.display_sessions to authenticated;
grant select on table public.session_members to authenticated;
grant select on table public.baskets to authenticated;
grant select, insert, update, delete on table public.basket_items to authenticated;

alter table public.display_sessions replica identity full;
alter table public.baskets replica identity full;
alter table public.basket_items replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'display_sessions'
  ) then
    execute 'alter publication supabase_realtime add table public.display_sessions';
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'baskets'
  ) then
    execute 'alter publication supabase_realtime add table public.baskets';
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'basket_items'
  ) then
    execute 'alter publication supabase_realtime add table public.basket_items';
  end if;
end;
$$;

commit;
