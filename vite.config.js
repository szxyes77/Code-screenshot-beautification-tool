// @ts-check
/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import pkg from './package.json' with { type: 'json' }

const isAnalyze = process.env.ANALYZE === 'true'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    base: './',

    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
    },

    plugins: [
      react(),
      ...(isAnalyze
        ? [
            visualizer({
              filename: 'dist/stats.html',
              open: true,
              gzipSize: true,
              brotliSize: true,
              template: 'treemap',
            }),
          ]
        : []),
    ],

    server: {
      port: 5173,
      strictPort: true,
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      minify: isProduction ? 'terser' : 'esbuild',
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          }
        : undefined,

      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return

            if (
              /[/\\]node_modules[/\\](react|react-dom|scheduler)[/\\]/.test(id)
            ) {
              return 'react-vendor'
            }

            if (
              /[/\\]node_modules[/\\](shiki|@shikijs|oniguruma)[/\\]/.test(id)
            ) {
              return 'shiki-vendor'
            }
          },
        },
      },

      chunkSizeWarningLimit: 500,
    },

    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  }
})
