import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Avoid lightningcss's native platform-specific binary entirely —
    // this is what was crashing on Vercel (Linux) when the lockfile
    // was generated on a different OS (e.g. Windows locally). esbuild's
    // CSS minifier is pure JS, so there's no binary-mismatch risk.
    cssMinify: "esbuild",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});