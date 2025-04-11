// vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:3001", // Your backend
        ws: true, // Enable WebSocket proxy
        changeOrigin: true,
      },
    },
  },
});
