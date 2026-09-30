# src/

Application source. Each subdirectory has its own `CLAUDE.md`.

- `main.tsx` — React entry; mounts `<App />` into `#root`.
- `App.tsx` — container: DDL state → `useSchema` → `useDiagram`; wires editor, format and diagram into `AppLayout`.
- `db/` — PGlite + catalog introspection (see `db/CLAUDE.md`).
- `layout/` — table sizing + ELK layout (see `layout/CLAUDE.md`).
- `diagram/` — React Flow diagram (see `diagram/CLAUDE.md`).
- `theme/` — palette, index and type icons (see `theme/CLAUDE.md`).
- `editor/` — CodeMirror editor, autocomplete, format (see `editor/CLAUDE.md`).
- `ui/` — app chrome (see `ui/CLAUDE.md`).
