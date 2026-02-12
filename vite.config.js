import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path"; // Adiciona esta importação

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
      // AJUSTE AQUI: Usa path.resolve para garantir que o build encontre os ficheiros
      "bittorrent-dht": path.resolve(__dirname, "./src/utils/webtorrent-shim.js"),
      "bittorrent-lsd": path.resolve(__dirname, "./src/utils/webtorrent-shim.js"),
    },
  },
});
