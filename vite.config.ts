import { defineConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => {
  const inlineEverything = mode === 'single' || mode === 'viewer'
  return {
    base: './',
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      ...(inlineEverything ? [viteSingleFile()] : []),
    ],
    build: {
      outDir: inlineEverything ? `dist-${mode}` : 'dist',
      assetsInlineLimit: inlineEverything ? Number.MAX_SAFE_INTEGER : 4096,
    },
    optimizeDeps: { exclude: ['@electric-sql/pglite', '@electric-sql/pglite-pgvector'] },
    test: { environment: 'node' },
  }
})
