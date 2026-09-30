# webmcp-pglite-erd-diagram

Offline ERD diagram tool for Postgres. Write DDL, [PGlite](https://pglite.dev) runs it, and the
resulting catalog is rendered as an interactive diagram. Nothing leaves the browser. Supports WebMCP

## Why

I'm pretty annoyed by the state of online ERD diagrams.

- They cost money for the most basic of features like export to PNG
- AI shoehorned in, forcing you to use their LLM chat
- They don't support native postgres comments

So I built this. You can even export to a single file html file (diagram only)

## Problems

WebMCP still needs some work.

## Features

- DDL editor (CodeMirror) with Postgres highlighting, autocomplete from your own tables/columns, and **Format** (prettier)
- Live diagram: tables, columns with a type icon each, PK/FK marks, foreign-key edges
- Distinct nodes for **views** (green, dashed), **materialized views** (lime), **partitioned tables** (orange, partitions and bounds nested inside), with dashed dependency edges from what the views read
- DB comments on tables, columns and indexes (small italic text)
- Inline index badges per column — FTS, trigram, vector (hnsw/ivfflat), GIN, GiST, B-tree, hash, BRIN, SP-GiST — each with its own icon and neon colour; multi-column indexes colour every member column
- Extensions available in DDL: `pg_trgm`, `btree_gin`, `btree_gist`, `vector`
- DDL is saved in the URL hash (shareable, never sent anywhere) and localStorage
- Export high-res PNG, SVG, or a standalone diagram-only HTML file (no DDL, no PGlite)
- [WebMCP](specs/webmcp.md) tools (`read_sql`, `format_sql`, `validate_sql`, `write_sql`, `read_schema`) so an LLM extension can edit the schema for people who don't write SQL; the polyfill is lazy-loaded and never part of the HTML export. An "Updated by AI · Restore previous" bar undoes an agent's rewrite
- Opt-in **Agent bridge** for desktop agents (Claude Desktop, Cursor, Claude Code) through the local `@mcp-b/webmcp-local-relay`; see below

## Run

```bash
bun install
bun run dev            # dev server (builds the viewer template first)
bun run build          # optimized static site in dist/ (multi-file; serve it, e.g. `bunx vite preview`)
bun run build:viewer   # dist-viewer/viewer.html: the small diagram-only template used by the HTML export
bun run test           # vitest
bun run format         # prettier
```


## Connecting a desktop agent

1. Click **Agent bridge** in the toolbar (off by default; the page then connects to `ws://127.0.0.1:9333`).
2. Run the relay: `npx @mcp-b/webmcp-local-relay`.
3. Add it to your agent, e.g. `claude mcp add webmcp-local-relay -- npx -y @mcp-b/webmcp-local-relay@latest`.

The agent can then read, validate, format and rewrite the DDL in that tab. Verify the chain with `URL=http://localhost:5199/ node scripts/verify-relay.mjs`. Details and limitations: [specs/webmcp.md](specs/webmcp.md).

