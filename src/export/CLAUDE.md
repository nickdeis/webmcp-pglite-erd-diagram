# src/export/

Getting the diagram out of the app.

- `ExportButtons.tsx` — container: PNG / SVG / standalone HTML buttons using live React Flow nodes (positions include user drags).
- `image.ts` — `renderDiagramImage`: html-to-image over the whole React Flow viewport (all tables, 3x pixel ratio capped for canvas limits).
- `standaloneHtml.ts` — `buildStandaloneHtml`: injects `{ schema, positions }` into the prebuilt viewer template (`virtual:viewer-template`, from `dist-viewer/viewer.html`).
- `download.ts` — `downloadUrl` / `downloadText` helpers.
