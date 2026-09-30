# src/

Application source. Each subdirectory has its own `CLAUDE.md`.

- `main.tsx` — React entry; mounts `<App />` into `#root`.
- `App.tsx` — top-level component (currently renders the fixture DDL; editor comes next).
- `db/` — PGlite + catalog introspection (see `db/CLAUDE.md`).
- `layout/` — table sizing + ELK layout (see `layout/CLAUDE.md`).
- `diagram/` — React Flow diagram (see `diagram/CLAUDE.md`).
- `theme/` — palette, index and type icons (see `theme/CLAUDE.md`).
