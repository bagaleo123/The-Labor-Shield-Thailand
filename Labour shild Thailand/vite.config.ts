import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    // В новых версиях плагин называется именно так
    TanStackRouterVite(),
    react(),
    tsconfigPaths(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
