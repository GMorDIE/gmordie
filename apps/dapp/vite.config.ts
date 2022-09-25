import react from "@vitejs/plugin-react";
import analyze from "rollup-plugin-analyzer";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   host: true,
  // },
  plugins: [react(), svgr()],
  build: {
    rollupOptions: {
      plugins: [
        analyze({
          summaryOnly: true,
          limit: 5,
        }),
      ],
    },
  },
});
