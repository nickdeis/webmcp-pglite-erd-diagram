/** Views, materialized views, and partitions (kept apart so FIXTURE_DDL stays tables-only). */
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
`
