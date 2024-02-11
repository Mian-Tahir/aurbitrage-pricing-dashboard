import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv"

// https://vitejs.dev/config/
export default defineConfig(() => {
  dotenv.config()
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: process.env.API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
