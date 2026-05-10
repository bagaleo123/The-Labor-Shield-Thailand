import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "src/server.ts" }, // Проверь, что этот файл существует
  },
});
