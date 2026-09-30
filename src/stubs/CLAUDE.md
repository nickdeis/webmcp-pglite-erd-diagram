# src/stubs/

Stand-ins for heavy dependencies we never call, aliased in `vite.config.ts`.

- `node-sql-parser.ts` — empty `Parser`; `prettier-plugin-sql` constructs one at import time but we only use its `sql-formatter` engine. Saves ~2.4 MB of source from the bundle.
