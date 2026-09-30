# src/db/

PGlite + catalog introspection. PGlite is the DDL parser: run the DDL, read `pg_catalog`.

- `types.ts` — `Schema` / `Table` / `Column` / `Index` / `ForeignKey` / `IndexKind` model shared by the whole app.
- `queries.ts` — SQL for tables, columns, constraints (PK/FK) and indexes; excludes system and extension-owned objects.
- `introspect.ts` — runs the queries against any `Queryable` and assembles a `Schema`.
- `indexKind.ts` — `classifyIndex`: FTS / trigram / vector win over the raw access method.
- `pglite.ts` — `createDb` (PGlite with pg_trgm, btree_gin, btree_gist, pgvector) and `schemaFromDdl`, which runs DDL + introspection in a transaction that is always rolled back.
- `useSchema.ts` — hook: debounced run of the DDL in PGlite (latest wins); keeps the last good schema while the DDL has errors and reports Postgres errors with a line number.
- `sample.ts` — default DDL shown on first visit.
- `fixture.ts` — sample DDL covering FKs, comments, enums, arrays, FTS/trigram/vector/composite indexes (reused by tests).
- `introspect.test.ts` — vitest suite against the fixture (PGlite runs in Node).
