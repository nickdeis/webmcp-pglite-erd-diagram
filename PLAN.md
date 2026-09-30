# PLAN

Full plan: `~/.claude/plans/create-a-plan-to-gentle-harbor.md`. Summary:

**Core idea:** PGlite is the DDL parser — run the DDL, read `pg_catalog`, render the schema.

Pipeline: DDL → PGlite → Schema JSON → ELK layout → React Flow diagram. The standalone export injects
Schema JSON + positions into a prebuilt viewer template (no PGlite, no editor).

Milestones: M0 bootstrap · M1 introspection · M2 diagram · M3 editor · M4 persistence · M5 exports ·
M6 build targets · M7 polish. Progress is tracked in [TODO.md](TODO.md).

Decided: palette from VS Code `2026-dark.json`; formatting via prettier + prettier-plugin-sql (wraps sql-formatter).
Single-file build is ~26 MB (mostly the Postgres WASM + data bundle); further shrinking would need compressing assets (DecompressionStream).
