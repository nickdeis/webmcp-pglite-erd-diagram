import { existsSync, readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { viteSingleFile } from 'vite-plugin-singlefile'

const VIEWER_TEMPLATE = 'dist-viewer/viewer.html'

/** Exposes the prebuilt diagram-only viewer as a string (empty if it has not been built yet). */
function viewerTemplate(): Plugin {
  const id = 'virtual:viewer-template'
  return {
    name: 'viewer-template',
    resolveId: (source) => (source === id ? `\0${id}` : undefined),
    load(loaded) {
      if (loaded !== `\0${id}`) return
      const html = existsSync(VIEWER_TEMPLATE) ? readFileSync(VIEWER_TEMPLATE, 'utf8') : ''
      return `export default ${JSON.stringify(html)}`
    },
  }
}

export default defineConfig(({ mode }) => {
  const isViewer = mode === 'viewer'
  const inlineEverything = mode === 'single' || isViewer
  return {
    base: './',
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      viewerTemplate(),
      ...(inlineEverything ? [viteSingleFile()] : []),
    ],
    build: {
      outDir: inlineEverything ? `dist-${mode}` : 'dist',
      assetsInlineLimit: inlineEverything ? Number.MAX_SAFE_INTEGER : 4096,
      ...(isViewer ? { rollupOptions: { input: 'viewer.html' } } : {}),
    },
    optimizeDeps: { exclude: ['@electric-sql/pglite', '@electric-sql/pglite-pgvector'] },
    test: { environment: 'node' },
  }
})
