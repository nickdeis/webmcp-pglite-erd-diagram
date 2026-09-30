# scripts/

Dev helpers, not shipped.

- `screenshot.mjs` — `node scripts/screenshot.mjs <url> <out.png> [--offline]`: opens a page in system Chrome via playwright-core, waits for a React Flow node, saves a 2x screenshot and lists any external network requests.
- `verify-relay.mjs` — `URL=http://localhost:5199/ node scripts/verify-relay.mjs`: end-to-end check of the agent bridge. Starts a real `webmcp-local-relay`, turns the bridge on in Chrome, and drives it as an MCP client over stdio (list tools, `read_sql`, `write_sql`, an invalid `write_sql`, then turns the bridge off).
