import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    proxy: {
      // ✅ API calls
      "/api": {
        target: "http://localhost",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api/, "/Sites/production/davidschu_new/public/api"),
      },

      // ✅ CSS, images, JS (anything under /assets)
      "/assets": {
        target: "http://localhost",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            /^\/assets/,
            "/Sites/production/davidschu_new/public/assets",
          ),
      },
    },
  },
});
