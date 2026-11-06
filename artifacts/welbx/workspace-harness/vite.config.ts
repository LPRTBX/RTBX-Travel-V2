// Isolated review workspace. Not part of the Travel production build: it has its own root, config and output, and nothing
// in the production server's allowlist or the main Vite config refers to it. Core is resolved from a pinned sibling checkout
// by alias; no kernel file is copied and no dependency is added to Travel's lockfile.
import { defineConfig } from "vite";
import { readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { resolve } from "node:path";

const here = import.meta.dirname;
const pin = JSON.parse(readFileSync(resolve(here, "core-pin.json"), "utf8"));
export const coreDir = resolve(process.env.JALDO_CORE_DIR ?? resolve(here, pin.defaultRelativePath));
const core = resolve(coreDir, "lib/jaldo-orchestration/src");

export const sharedAlias = {
  "@workspace/jaldo-orchestration/deployments": resolve(core, "deployments/index.ts"),
  "@workspace/jaldo-orchestration": resolve(core, "index.ts"),
};

/** The build copies Travel's public folder; keep only the two approved assets this harness uses. */
const onlyApprovedAssets = () => ({
  name: "only-approved-assets",
  closeBundle() {
    const out = resolve(here, "dist");
    const keep = new Set(["index.html", "assets", "brand", "images", "brand/jaldo-logo-white.webp", "images/travel", "images/travel/arrival-hero.webp"]);
    const walk = (dir: string, rel = "") => {
      for (const name of readdirSync(dir)) {
        const r = rel ? `${rel}/${name}` : name;
        if (!keep.has(r)) { rmSync(resolve(dir, name), { recursive: true, force: true }); continue; }
        if (statSync(resolve(dir, name)).isDirectory() && r !== "assets") walk(resolve(dir, name), r);
      }
    };
    walk(out);
  },
});

export default defineConfig({
  plugins: [onlyApprovedAssets()],
  root: here,
  publicDir: resolve(here, "../public"), // approved hero image and logo are read from Travel's public folder
  resolve: { alias: sharedAlias },
  define: { __CORE_PIN__: JSON.stringify({ commit: pin.commit, contractVersion: pin.contractVersion }) },
  server: { host: "127.0.0.1", port: 5320, fs: { allow: [here, resolve(here, ".."), coreDir] } },
  preview: { host: "127.0.0.1", port: 5320 },
  build: { outDir: resolve(here, "dist"), emptyOutDir: true, target: "es2022" },
});
