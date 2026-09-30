# src/layout/

Positions and sizes for tables. No DOM measuring, so results are deterministic and testable in Node.

- `sizing.ts` — `METRICS` (shared with the renderer), `tableSize`, `columnRowHeight`, `indexRowHeight`.
- `elk.ts` — `layoutSchema`: ELK layered layout, referenced tables left of referencing ones; `tableKey`.
- `layout.test.ts` — sizing and layout tests against the fixture DDL.
