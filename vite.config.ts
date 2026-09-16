import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        scene: resolve(__dirname, "scene.html"),
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
