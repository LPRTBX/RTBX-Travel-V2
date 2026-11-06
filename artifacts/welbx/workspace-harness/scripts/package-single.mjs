// Packages the built workspace (dist/) into ONE self-contained HTML file: JS, CSS and the two approved images are embedded.
// It does not change the app or the build; it only reads dist/. Output: dist-single/jaldo-travel-review-workspace.html
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const assets = readdirSync(resolve(dist, "assets"));
const js = assets.filter((f) => f.endsWith(".js")), css = assets.filter((f) => f.endsWith(".css"));
if (js.length !== 1 || css.length > 1) throw new Error(`unexpected build output: ${assets.join(", ")}`);
const uri = (rel, type) => `data:${type};base64,${readFileSync(resolve(dist, rel)).toString("base64")}`;
const IMAGES = { "/images/travel/arrival-hero.webp": uri("images/travel/arrival-hero.webp", "image/webp"), "/brand/jaldo-logo-white.webp": uri("brand/jaldo-logo-white.webp", "image/webp") };
let code = readFileSync(resolve(dist, "assets", js[0]), "utf8");
for (const [path, data] of Object.entries(IMAGES)) { if (!code.includes(path)) throw new Error(`asset not referenced: ${path}`); code = code.split(path).join(data); }
const style = css.length ? readFileSync(resolve(dist, "assets", css[0]), "utf8") : "";
if (/url\(\s*["']?\/(?!\/)/.test(style)) throw new Error("css refers to a site-root path");
const safeJs = code.replace(/<\/script/gi, "<\\/script");
const html = readFileSync(resolve(dist, "index.html"), "utf8")
  .replace(/\s*<script type="module"[^>]*><\/script>/, "")
  .replace(/\s*<link rel="stylesheet"[^>]*>/, () => `\n    <style>${style}</style>`)
  .replace("</body>", () => `  <script type="module">${safeJs}</script>\n  </body>`);
if (/(src|href)="\/(?!\/)/.test(html) || /<script[^>]+src=/.test(html)) throw new Error("packaged file still refers to an external path");
mkdirSync(resolve(root, "dist-single"), { recursive: true });
const out = resolve(root, "dist-single/jaldo-travel-review-workspace.html");
writeFileSync(out, html);
console.log(`wrote ${out} (${(html.length / 1048576).toFixed(2)} MB)`);
