import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:81",
        changeOrigin: true,

        rewrite: (path) =>
          path.replace(/^\/api/, "/sites/production/davidschu_new/public/api"),

        secure: false,
      },
    },
  },
});
