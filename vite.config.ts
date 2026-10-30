import { defineConfig } from "vite";

// Photos are read in place from the existing storefront project (nothing is copied or changed there).
// /images/... and /test_images/... resolve to E:/Projects/LEADS/Maqdooms/MBM_03/public/...
export default defineConfig({
  publicDir: "../MBM_03/public",
  build: { copyPublicDir: false },
  server: { port: 5182 },
});
