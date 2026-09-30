# src/editor/

DDL editing. Display components are pure; state lives in `App.tsx` / `db/useSchema.ts`.

- `SqlEditor.tsx` — CodeMirror with Postgres dialect, autocomplete namespace, Cmd/Ctrl+Shift+F to format.
- `ErrorBanner.tsx` — shows the Postgres error (with line) for the current DDL.
- `completion.ts` — `completionNamespace`: tables → column names from the last good schema.
- `format.ts` — `formatSql`: prettier + prettier-plugin-sql (postgresql, lower-case keywords).
- `theme.ts` — CodeMirror theme in the 2026 Dark palette.
