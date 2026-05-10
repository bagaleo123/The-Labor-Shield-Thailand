import { defineConfig } from "vite";
import { tanstackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tanstackRouterVite(),
    react(),
    tsconfigPaths(),
  ],
  build: {
    outDir: 'dist',
    // Это важно для Render, чтобы он видел выходные файлы
    emptyOutDir: true,
  }
});
