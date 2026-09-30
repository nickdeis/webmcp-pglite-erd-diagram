# src/viewer/

Entry for the diagram-only standalone HTML (built from `/viewer.html` with `bun run build:viewer`).
Must never import PGlite, CodeMirror or ELK.

- `main.tsx` — reads the embedded `#diagram-data` JSON and mounts `ViewerApp`.
- `ViewerApp.tsx` — container: builds nodes/edges from the payload and renders `Diagram` (tables stay draggable).
- `payload.ts` — `ViewerPayload` type and `readPayload`. The injection placeholder deliberately lives in `export/` so it never appears in the viewer bundle.
