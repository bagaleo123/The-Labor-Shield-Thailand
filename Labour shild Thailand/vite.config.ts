import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Отключаем SSR, чтобы билд прошел для статического сайта Render
    ssr: false, 
  },
  // Убираем конфликт с Cloudflare Wrangler
  vite: {
    build: {
      outDir: 'dist',
    }
  }
});
