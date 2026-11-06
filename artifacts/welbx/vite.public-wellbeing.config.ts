import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const project = import.meta.dirname;
// Deliberately independent of App.tsx, its router, providers and protected chunks.
const approvedSharedSources = new Set([
  "src/components/partner-room/WellbeingSupportScenario.tsx",
  "src/components/partner-room/wellbeing-support.css",
  "src/lib/wellbeingSupport.ts",
]);

export default defineConfig({
  root: path.resolve(project, "src/public-wellbeing"),
  base: "/public-wellbeing/",
  publicDir: false,
  envPrefix: "JALDO_PUBLIC_",
  resolve: {
    alias: { "@": path.resolve(project, "src") },
    dedupe: ["react", "react-dom"],
  },
  plugins: [
    react(),
    {
      name: "public-wellbeing-source-boundary",
      transformIndexHtml: {
        order: "post",
        // Use the existing approved public icon, without copying any public directory.
        handler: () => [{ tag: "link", attrs: { rel: "icon", href: "/favicon.svg" }, injectTo: "head" }],
      },
      generateBundle(_options, bundle) {
        for (const output of Object.values(bundle)) {
          if (output.type !== "chunk") continue;
          for (const id of Object.keys(output.modules)) {
            if (id.includes("/node_modules/") || id.startsWith("\0")) continue;
            const source = path.relative(project, id.split("?")[0]).replaceAll("\\", "/");
            if (!source.startsWith("src/public-wellbeing/") && !approvedSharedSources.has(source)) {
              this.error(`Unapproved source in public wellbeing build: ${source}`);
            }
          }
        }
      },
    },
  ],
  build: {
    outDir: path.resolve(project, "dist/wellbeing"),
    emptyOutDir: true,
    sourcemap: false,
  },
});
