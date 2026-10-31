begin;

alter table public.baskets
  drop constraint if exists baskets_color_check;

alter table public.baskets
  add constraint baskets_color_check
  check (color in ('blue', 'red', 'green', 'yellow', 'orange', 'purple', 'pink'));

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

  return query
  select created_session_id, generated_code, created_expiry;
end;
$$;

commit;
