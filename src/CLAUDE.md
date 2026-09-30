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
- `state/` — DDL persistence in URL hash + localStorage (see `state/CLAUDE.md`).
- `export/` — PNG/SVG/standalone HTML export (see `export/CLAUDE.md`).
- `viewer/` — diagram-only entry for the standalone HTML (see `viewer/CLAUDE.md`).
- `virtual.d.ts` — types for the `virtual:viewer-template` module.
- `stubs/` — aliased stand-ins for unused heavy deps (see `stubs/CLAUDE.md`).
- `mcp/` — WebMCP tools for LLM extensions (see `mcp/CLAUDE.md`).
