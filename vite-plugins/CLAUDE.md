# vite-plugins/

Build-time Vite plugins used by `vite.config.ts`.

- `viewerTemplate.ts` — `virtual:viewer-template`: the prebuilt `dist-viewer/viewer.html` as a string for the standalone export.
- `inlinePgliteAssets.ts` — single-file build only: dedupes PGlite's repeated `new URL('./x.wasm', import.meta.url)` references so each big asset is inlined once.
