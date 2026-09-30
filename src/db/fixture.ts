export const FIXTURE_DDL = `
create extension pg_trgm;
create extension vector;
create type mood as enum ('happy', 'sad');

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name varchar(80),
  mood mood,
  tags text[],
  bio tsvector,
  created_at timestamptz default now()
);
comment on table users is 'Application users';
comment on column users.email is 'Login address';

create table posts (
  id bigint generated always as identity primary key,
  author_id uuid not null references users(id) on delete cascade,
  title text,
  body text,
  embedding vector(3),
  meta jsonb
);
create index posts_body_fts on posts using gin (to_tsvector('english', body));
create index users_bio_fts on users using gin (bio);
create index users_name_trgm on users using gin (name gin_trgm_ops);
create index posts_embedding_hnsw on posts using hnsw (embedding vector_l2_ops);
create index posts_author_title on posts (author_id, title);
comment on index posts_author_title is 'Author feed';

create table memberships (
  user_id uuid references users(id),
  org_id int,
  primary key (user_id, org_id),
  foreign key (user_id, org_id) references memberships (user_id, org_id) deferrable
);
`
