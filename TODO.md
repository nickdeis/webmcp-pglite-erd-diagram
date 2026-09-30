# TODO

## Done

- [x] Milestone 0: git init, deps (vite, react compiler, pglite, pgvector, xyflow, elk, codemirror), configs, docs
- [x] M1: PGlite init, catalog introspection, index kind classification (vitest, 6 tests)
- [x] M2: theme (Dark 2026), table nodes, type/index icons + badges, comments, FK edges, ELK layout
- [x] M3: CodeMirror editor, live run, errors (with line), autocomplete from schema, format SQL (prettier + prettier-plugin-sql)
- [x] M4: persistence (URL hash via lz-string + localStorage, precedence URL > local > sample)
- [x] M5: PNG/SVG export (html-to-image, 3x), viewer entry, standalone diagram-only HTML export (verified offline via file://)
- [x] M6: static + single-file builds verified offline (file://); PGlite assets deduped (54 MB → 26 MB); node-sql-parser stubbed (6.3 → 4.0 MB JS)
- [x] M7: multi-column index group highlight, loading/empty overlay, sample DDL

- [x] Removed the single-file app build (`build:single`, `inlinePgliteAssets`); HTML export covers it

- [x] WebMCP: five tools (`read_sql`, `format_sql`, `validate_sql`, `write_sql`, `read_schema`), lazy polyfill, restore bar, spec updated; verified in Chrome (dev + production build)

- [x] Views, materialized views, partitions (nested in parent) and table functions: introspection, distinct icons/colours, dependency edges

- [x] Overlapping multi-column index groups of one kind get distinct colours; self-referencing FKs draw a loop

## Ideas / next
