// vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".", // root is the project base (where index.html is)
  build: {
    outDir: "dist", // where to output production build
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"), // explicitly define entry HTML
    },
  },
  server: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:3001",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
