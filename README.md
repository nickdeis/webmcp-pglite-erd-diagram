# pglite-diagram

Offline ERD diagram tool for Postgres. Write DDL, [PGlite](https://pglite.dev) runs it, and the
resulting catalog is rendered as an interactive diagram (React Flow + ELK). Nothing leaves the browser.

## Features

- DDL editor (CodeMirror) with Postgres highlighting, autocomplete from your own tables/columns, and **Format** (prettier)
- Live diagram: tables, columns with a type icon each, PK/FK marks, foreign-key edges
- DB comments on tables, columns and indexes (small italic text)
- Inline index badges per column — FTS, trigram, vector (hnsw/ivfflat), GIN, GiST, B-tree, hash, BRIN, SP-GiST — each with its own icon and neon colour; multi-column indexes colour every member column
- Extensions available in DDL: `pg_trgm`, `btree_gin`, `btree_gist`, `vector`
- DDL is saved in the URL hash (shareable, never sent anywhere) and localStorage
- Export high-res PNG, SVG, or a standalone diagram-only HTML file (no DDL, no PGlite)
- [WebMCP](specs/webmcp.md) tools (`read_sql`, `format_sql`, `validate_sql`, `write_sql`, `read_schema`) so an LLM extension can edit the schema for people who don't write SQL; the polyfill is lazy-loaded and never part of the HTML export. An "Updated by AI · Restore previous" bar undoes an agent's rewrite
- VS Code "2026 Dark" palette with neon accents

## Run

```bash
bun install
bun run dev            # dev server (builds the viewer template first)
bun run build          # optimized static site in dist/ (multi-file; serve it, e.g. `bunx vite preview`)
bun run build:viewer   # dist-viewer/viewer.html: the small diagram-only template used by the HTML export
bun run test           # vitest
bun run format         # prettier
```

Notes:

- `dist/` uses ES modules, which browsers refuse to load from `file://`; serve it from any static host (or `bunx vite preview`). It makes no network requests once loaded.
- For a single self-contained file, use the **HTML** export in the toolbar: it is diagram-only (no DDL editor, no PGlite) and opens from `file://`.
- `node scripts/screenshot.mjs <url> <out.png>` drives system Chrome (playwright-core) for visual checks and lists external requests (should be none).

See [DESIGN.md](DESIGN.md) for architecture, [PLAN.md](PLAN.md) and [TODO.md](TODO.md) for status.
