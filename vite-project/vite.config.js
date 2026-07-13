import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  // Force Vite 8 to use the stable bundler + minifier
  build: {
    rollupOptions: {
      // This helps avoid Rolldown issues
    },
    minify: 'esbuild',        // Use esbuild instead of lightningcss
    cssMinify: 'esbuild'
  }
})