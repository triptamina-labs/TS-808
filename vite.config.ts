import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

import { cloudflare } from "@cloudflare/vite-plugin";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(rootDir, "src");

export default defineConfig({
  root: rootDir,
  plugins: [react(), tailwindcss(), cloudflare()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": srcDir,
      app: path.resolve(srcDir, "app"),
      domain: path.resolve(srcDir, "domain"),
      features: path.resolve(srcDir, "features"),
      ui: path.resolve(srcDir, "ui"),
      styles: path.resolve(srcDir, "styles"),
      shared: path.resolve(srcDir, "shared"),
      components: path.resolve(srcDir, "ui/components"),
      layouts: path.resolve(srcDir, "ui/layouts"),
      theme: path.resolve(srcDir, "ui/theme"),
      selectors: path.resolve(srcDir, "domain/state/selectors"),
      reducers: path.resolve(srcDir, "domain/state/reducers"),
      synth: path.resolve(srcDir, "domain/audio/synth"),
      utils: path.resolve(srcDir, "shared/utils"),
      globalStyles: path.resolve(srcDir, "styles"),
      store: path.resolve(srcDir, "app/store/index.ts"),
      actionCreators: path.resolve(srcDir, "domain/state/actionCreators.ts"),
      actionTypes: path.resolve(srcDir, "domain/state/actionTypes.ts"),
      "store-constants": path.resolve(srcDir, "domain/state/store-constants.ts"),
      initialState: path.resolve(srcDir, "domain/state/initialState.ts"),
      helpers: path.resolve(srcDir, "domain/helpers.ts"),
      audioCtxContext: path.resolve(srcDir, "app/providers/audioCtxContext.tsx")
    }
  },
  server: {
    host: true,
    port: 3000
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"]
  }
});