# pglite-diagram

I'd would like to create an ERD diagram tool for postgres using pglite. It should be completely offline.

## Stack

- pglite
- prettier
- vite with react compiler plugin
- React
- react-icons
- @xyflow/react
- elkjs for layout
- @uiw/react-codemirror for putting in DDL

## Support for

- DB comments on indexes, columns, tables (show up as smaller text)
- FTS, vector, trigram, and all other built-in indexes inline with the column with an icon to delineate them
    - If multiple columns highlight them with the same color and the icon (a column group)
- Foreign keys
- display all types, and each type should get an icon
- default to dark mode with neon highlights, use vscode Dark 2026 as a color palette

## Build Targets

- Static html offline optimized
- single bundled

## Other features

- export to highres png or svg
- format sql
- autocomplete based off the ddl already written
- ddl saves in url and also localStorage
- export to single bundle html file, diagram only, no ddl, no pglite

## Rules

- Each subdirectory should have a `CLAUDE.md` that explains what the directory is for and what each file is for
- Update every `CLAUDE.md` after making changes, including this one

## Layout

- `src/` — application source (see `src/CLAUDE.md`)
- `vite.config.ts` — Vite config; `--mode single` / `--mode viewer` inline everything into one HTML file
- `index.html` — app entry HTML; `viewer.html` — entry for the diagram-only viewer (`bun run build:viewer` → `dist-viewer/viewer.html`, embedded into the app via the `virtual:viewer-template` plugin in `vite.config.ts`)
- `README.md`, `DESIGN.md`, `PLAN.md`, `TODO.md` — project docs (kept up to date after every change)
- `scripts/` — dev helpers (see `scripts/CLAUDE.md`)
