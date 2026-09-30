### Goal
Make the WebMCP tools defined in `createTools()` fully discoverable and executable by AI agents, both within the browser (via the WebMCP / `document.modelContext` standard) and externally from IDE/desktop AI agents (Cursor, Claude Desktop, Claude Code) via an MCP bridge.

### Current Status
We have a tool factory (`createTools`) using `@mcp-b/webmcp-types` that returns tool definitions for `read_sql`, `format_sql`, `validate_sql`, `write_sql`, and `read_schema`. However, AI agents currently cannot execute these tools because:
1. The tools are not registered with the browser's model context lifecycle (`document.modelContext` / `navigator.modelContext`).
2. There is no transport bridge exposing these browser-side tools to external MCP clients running over stdio or SSE.

### Requirements

#### 1. In-Browser WebMCP Registration
* Install and import `@mcp-b/global` (or the appropriate WebMCP polyfill) so `document.modelContext` is available in browsers without native flag support.
* Hook up `createTools(deps)` to the app initialization/component mount lifecycle.
* Loop over each tool returned by `createTools` and register it using the official standard:
  ```ts
  if ('modelContext' in document && typeof document.modelContext?.registerTool === 'function') {
    // Register each tool with document.modelContext
  }