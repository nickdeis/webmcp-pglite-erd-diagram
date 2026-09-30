# src/state/

Where the DDL lives between visits.

- `persistence.ts` — pure helpers: `ddlToHash` / `ddlFromHash` (lz-string in `#d=`), safe localStorage read/write, `initialDdl` (URL > localStorage > sample).
- `usePersistedDdl.ts` — hook: DDL state, debounced write to `location.hash` (via `replaceState`) + localStorage, follows `hashchange`.
- `persistence.test.ts` — round-trip, precedence and broken-storage tests.
