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
  Agent[LLM extension] -->|document.modelContext| Tools[WebMCP tools]
  Desktop[Claude Desktop / Cursor / Claude Code] <-->|stdio| Relay[local relay]
  Relay <-->|WebSocket, opt-in| Tools
  Tools -->|read / write DDL| Editor
  Tools -->|validate / read_schema| DB
```

The WebMCP code (`src/mcp/`), its lazy polyfill and the relay files (`dist/relay/`, only loaded when the user turns on the agent bridge) are never part of the viewer, so they stay out of the HTML export. See [specs/webmcp.md](specs/webmcp.md).

## Build targets

```mermaid
flowchart TD
  Src[src/] --> Static[bun run build: dist/ static multi-file]
  Src --> Viewer[bun run build:viewer: diagram-only template]
  Viewer -->|?raw import| Static
```

## Bundle notes

There is no single-file app build: inlining the Postgres WASM and data bundle made it ~26 MB, and the diagram-only HTML
export covers that need. `prettier-plugin-sql`'s unused `node-sql-parser` is aliased to a stub (`src/stubs/`).
