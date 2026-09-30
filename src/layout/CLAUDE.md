# src/layout/

Positions and sizes for tables. No DOM measuring, so results are deterministic and testable in Node.

- `sizing.ts` — `METRICS` (shared with the renderer), `tableSize` (incl. partitions section, capped with "+N more"), `columnRowHeight`, `indexRowHeight`, `relationLabel`.
- `keys.ts` — `Point`, and re-exports `tableKey` (kept ELK-free so the standalone viewer can import it).
- `partitionBound.ts` — `formatBound`: compact partition bound text.
- `elk.ts` — `layoutSchema`: ELK layered layout of tables and views; referenced tables / dependency sources sit left of what points at or reads them.
- `layout.test.ts`, `sizing.test.ts`, `partitionBound.test.ts` — layout against fixture DDL, and pure sizing/format tests.
