# vite-plugins/

Build-time Vite plugins used by `vite.config.ts`.

- `relayAssets.ts` — serves `relay/embed.js|widget.js|widget.html` from `@mcp-b/webmcp-local-relay` in dev and emits them into `dist/relay/` (not in the viewer build); the embed is only loaded when the user turns on the agent bridge.
- `viewerTemplate.ts` — `virtual:viewer-template`: the prebuilt `dist-viewer/viewer.html` as a string for the standalone export.
