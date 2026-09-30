# src/db/

PGlite + catalog introspection. PGlite is the DDL parser: run the DDL, read `pg_catalog`.

- `types.ts` — the model shared by the whole app: `Schema` (tables, dependencies), `Table` (a table, partitioned table, view or materialized view; `kind`, nested `partitions`), `Column`, `Index`, `ForeignKey`, `Dependency`, `IndexKind`.
- `keys.ts` — `tableKey`: node ids used by layout, edges and dependencies.
- `queries.ts` — SQL for tables/views/materialized views, columns, constraints (PK/FK) and indexes; excludes system and extension-owned objects and partitions (nested instead).
- `relationQueries.ts` — SQL for partitions (with bounds) and what each view reads.
- `catalogRows.ts` — row types for the queries above.
- `introspect.ts` — runs the queries against any `Queryable` and assembles a `Schema` from the two builders below.
- `introspectTables.ts` — tables/views/columns/indexes/FKs and the partition tree.
- `introspectDependencies.ts` — source → view edges (partitions resolve to their drawn parent; unknown nodes dropped).
- `indexKind.ts` — `classifyIndex`: FTS / trigram / vector win over the raw access method.
- `pglite.ts` — `createDb` (PGlite with pg_trgm, btree_gin, btree_gist, pgvector) and `schemaFromDdl`, which runs DDL + introspection in a transaction that is always rolled back.
- `instance.ts` — `getDb` (the single shared PGlite instance), `runDdl` (run + introspect, rolled back) and `runDdlOrExplain` (same, but rejects with a `Line N: message` error; used by the WebMCP tools).
- `ddlError.ts` — `DdlError`, `toDdlError` (Postgres error position → line) and `formatDdlError`.
- `useSchema.ts` — hook: debounced `runDdl` (latest wins); keeps the last good schema while the DDL has errors and reports Postgres errors with a line number.
- `builders.ts` — `makeTable` / `makeColumn` / `makeSchema` test helpers.
- `sample.ts` — default DDL shown on first visit.
- `fixture.ts` — sample DDL covering FKs, comments, enums, arrays, FTS/trigram/vector/composite indexes (reused by tests).
- `fixtureObjects.ts` — DDL for views, materialized views and partitions.
- `introspect.test.ts`, `introspectObjects.test.ts`, `ddlError.test.ts` — vitest (PGlite runs in Node).
