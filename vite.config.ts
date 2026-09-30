import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { relayAssets } from './vite-plugins/relayAssets.ts'
import { viewerTemplate } from './vite-plugins/viewerTemplate.ts'

const nodeSqlParserStub = fileURLToPath(new URL('./src/stubs/node-sql-parser.ts', import.meta.url))

export default defineConfig(({ mode }) => {
  const isViewer = mode === 'viewer'
  return {
    base: './',
    resolve: { alias: { 'node-sql-parser': nodeSqlParserStub } },
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      viewerTemplate(),
      ...(isViewer ? [viteSingleFile()] : [relayAssets()]),
    ],
    build: {
      outDir: isViewer ? 'dist-viewer' : 'dist',
      assetsInlineLimit: isViewer ? Number.MAX_SAFE_INTEGER : 4096,
      ...(isViewer ? { rollupOptions: { input: 'viewer.html' } } : {}),
    },
    optimizeDeps: { exclude: ['@electric-sql/pglite', '@electric-sql/pglite-pgvector'] },
    test: { environment: 'node' },
  }
})
