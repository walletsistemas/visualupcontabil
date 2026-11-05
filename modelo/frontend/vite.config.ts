import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  server: { port: 5173, strictPort: true },
  // programa de desktop: um arquivo só de 900 kB é normal (abre do disco, não da internet)
  build: { outDir: "dist", emptyOutDir: true, chunkSizeWarningLimit: 2000 },
});
