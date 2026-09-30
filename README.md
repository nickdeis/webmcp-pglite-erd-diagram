# pglite-diagram

Offline ERD diagram tool for Postgres. Write DDL, [PGlite](https://pglite.dev) runs it, and the
resulting catalog is rendered as an interactive diagram (React Flow + ELK). No network needed.

## Run

```bash
bun install
bun run dev            # dev server
bun run build          # static, optimized dist/
bun run build:single   # one self-contained HTML file (dist-single/)
bun run build:viewer   # diagram-only viewer template (dist-viewer/)
bun run test           # vitest
bun run format         # prettier
```

Status: under construction — see [PLAN.md](PLAN.md) and [TODO.md](TODO.md).
