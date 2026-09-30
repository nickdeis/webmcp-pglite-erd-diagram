# src/mcp/

WebMCP: lets an LLM extension read and rewrite the DDL. Spec: `specs/webmcp.md`. Never imported by `src/viewer/`, so the
polyfill and tools stay out of the diagram-only HTML export.

- `tools.ts` — `createTools(deps)`: pure factory for `read_sql`, `format_sql`, `validate_sql`, `write_sql`, `read_schema` (names, LLM-facing descriptions, JSON-Schema inputs, `readOnlyHint`). `write_sql` formats + validates before applying, and throws (changing nothing) otherwise.
- `register.ts` — `registerWebMcpTools`: uses native `document.modelContext` if present, else lazily `import()`s `@mcp-b/webmcp-polyfill`; mirrors the context onto `navigator.modelContext` (`mirrorModelContext`, an own property that shadows a read-only prototype getter) so in-browser agents such as Ask Gemini find it; unregisters when the `AbortSignal` aborts.
- `useWebMcp.ts` — hook: keeps the latest DDL in a ref for the tools, registers once when idle, and tracks the DDL an agent replaced (`previousDdl`, `restore`, `dismiss`).
- `relay.ts` — `enableRelay(document)`: loads the vendored `relay/embed.js` (configured with `data-relay-port`), returns a disconnect function; also `RELAY_COMMANDS` for the UI. The relay bridges `document.modelContext` to desktop agents (Claude Desktop, Cursor, Claude Code) via a local `@mcp-b/webmcp-local-relay` process.
- `useAgentBridge.ts` — hook: opt-in on/off flag (localStorage) that loads/unloads the relay embed; off by default so no localhost WebSocket is ever opened unless asked.
- `tools.test.ts`, `register.test.ts`, `relay.test.ts` — vitest (tools run against real PGlite; registration against a fake `modelContext`).
