/** Default DDL shown on first visit; exercises comments, FKs and every index icon. */
export const SAMPLE_DDL = `create extension if not exists pg_trgm;
create extension if not exists vector;

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name varchar(80),
  created_at timestamptz not null default now()
);
comment on table users is 'People who can sign in';
comment on column users.email is 'Login address';
create index users_display_name_trgm on users using gin (display_name gin_trgm_ops);

create table posts (
  id bigint generated always as identity primary key,
  author_id uuid not null references users (id) on delete cascade,
  title text not null,
  body text,
  tags text[],
  embedding vector(3),
  meta jsonb,
  published_at timestamptz
);
comment on table posts is 'Blog posts';
create index posts_author_published on posts (author_id, published_at);
comment on index posts_author_published is 'Author feed, newest first';
create index posts_body_fts on posts using gin (to_tsvector('english', body));
create index posts_embedding_hnsw on posts using hnsw (embedding vector_l2_ops);

create table comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references posts (id),
  author_id uuid references users (id),
  body text not null
);

create view published_posts as
  select id, author_id, title, published_at from posts where published_at is not null;
comment on view published_posts is 'Posts that are live';

create materialized view author_stats as
  select author_id, count(*) as post_count from posts group by author_id;
create index author_stats_author on author_stats (author_id);
comment on materialized view author_stats is 'Refreshed nightly';

create table audit_log (
  id bigint generated always as identity,
  logged_at timestamptz not null,
  action text not null
) partition by range (logged_at);
comment on table audit_log is 'Append-only event log';
create table audit_log_2025 partition of audit_log
  for values from ('2025-01-01') to ('2026-01-01');
create table audit_log_2026 partition of audit_log
  for values from ('2026-01-01') to ('2027-01-01');
create table audit_log_default partition of audit_log default;

create function posts_by_author(author uuid)
  returns table (id bigint, title text) language sql stable
  begin atomic
    select id, title from posts where author_id = author;
  end;
comment on function posts_by_author(uuid) is 'All posts written by one user';
`
