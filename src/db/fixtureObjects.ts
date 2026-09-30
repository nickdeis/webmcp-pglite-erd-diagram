/** Views, materialized views, partitions and table functions (kept apart so FIXTURE_DDL stays tables-only). */
export const FIXTURE_OBJECTS_DDL = `
create table users (id uuid primary key default gen_random_uuid(), email text not null unique, name text);
create table posts (
  id bigint primary key,
  author_id uuid references users (id),
  title text,
  created_at timestamptz
);

create view active_users as select id, email from users where name is not null;
comment on view active_users is 'Users with a name';
create view post_authors as
  select p.id as post_id, u.email from posts p join users u on u.id = p.author_id;
create view chained as select * from active_users;
create materialized view post_counts as select author_id, count(*) as posts from posts group by author_id;
create index post_counts_author on post_counts (author_id);

create table events (id bigint, happened_at timestamptz not null, region text)
  partition by range (happened_at);
create table events_2024 partition of events for values from ('2024-01-01') to ('2025-01-01');
create table events_2025 partition of events for values from ('2025-01-01') to ('2026-01-01')
  partition by list (region);
create table events_2025_eu partition of events_2025 for values in ('eu');
create table events_default partition of events default;
create view recent_events as select * from events_2024;

create function posts_by(author uuid, max_rows int default 10)
  returns table (id bigint, title text) language sql stable
  begin atomic
    select id, title from posts where author_id = author limit max_rows;
  end;
comment on function posts_by(uuid, int) is 'Posts for one author';
create function all_emails() returns setof text language sql as $$ select email from users $$;
create function stats(out total int, out newest timestamptz) language sql
  as $$ select 1, now() $$;
create function user_rows() returns setof users language sql as $$ select * from users $$;
create function scalar_fn(a int) returns int language sql as $$ select a $$;
create view uses_fn as select * from posts_by('00000000-0000-0000-0000-000000000000'::uuid, 3);
`
