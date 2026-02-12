import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
      globals: {
        global: true,
        process: true,
        Buffer: true,
      },
    }),
  ],
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
      "bittorrent-dht": "/src/utils/webtorrent-shim.js",
      "bittorrent-lsd": "/src/utils/webtorrent-shim.js",
    },
  },
});
