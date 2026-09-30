import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { inlinePgliteAssets } from './vite-plugins/inlinePgliteAssets'
import { viewerTemplate } from './vite-plugins/viewerTemplate'

const nodeSqlParserStub = fileURLToPath(new URL('./src/stubs/node-sql-parser.ts', import.meta.url))

export default defineConfig(({ mode }) => {
  const isViewer = mode === 'viewer'
  const inlineEverything = mode === 'single' || isViewer
  return {
    base: './',
    resolve: { alias: { 'node-sql-parser': nodeSqlParserStub } },
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      viewerTemplate(),
      ...(inlineEverything ? [inlinePgliteAssets(), viteSingleFile()] : []),
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
