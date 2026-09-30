# DESIGN

```mermaid
flowchart LR
  Editor[CodeMirror DDL] -->|debounce| DB[PGlite + extensions]
  DB -->|pg_catalog queries| Schema[Schema JSON]
  Schema --> Layout[elkjs layout]
  Layout --> Diagram[React Flow diagram]
  Schema --> Complete[Autocomplete]
  Complete --> Editor
  Editor <--> Persist[URL hash + localStorage]
  Diagram --> Img[PNG / SVG export]
  Schema --> Standalone[Standalone HTML export]
  Layout --> Standalone
  Viewer[Viewer template: React + xyflow only] --> Standalone
```

## Build targets

```mermaid
flowchart TD
  Src[src/] --> Static[bun run build: dist/ static multi-file]
  Src --> Single[bun run build:single: one HTML file, PGlite inlined]
  Src --> Viewer[bun run build:viewer: diagram-only template]
  Viewer -->|?raw import| Single
  Viewer -->|?raw import| Static
```

## Single-file asset handling

PGlite references each big asset (`pglite.wasm`, `initdb.wasm`, `pglite.data`) several times. In the single-file
build `vite-plugins/inlinePgliteAssets.ts` routes all references through one virtual module so each is inlined
once (54 MB → 26 MB). `prettier-plugin-sql`'s unused `node-sql-parser` is aliased to a stub (`src/stubs/`).
