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

## Ideas / next

- [ ] Distinguish overlapping multi-column indexes of the same kind (per-group colour variants)
- [ ] Self-referencing FK edges render as a short stub; give them a loop
- [ ] Views, materialized views, partitions
- [ ] Shrink the single file (compress WASM/data, inflate with DecompressionStream)
