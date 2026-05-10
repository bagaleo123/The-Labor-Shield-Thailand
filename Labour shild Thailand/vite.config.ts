import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // ВАЖНО: Мы отключаем SSR полностью, так как на бесплатном Render нет сервера
    ssr: false, 
  },
  vite: {
    build: {
      outDir: 'dist',
      // Эта настройка поможет избежать ошибок с манифестом
      emptyOutDir: true,
    }
  }
});
