#!/usr/bin/env node
/**
 * check-assets.mjs
 * Checks that locally referenced public assets exist in the public/ directory.
 *
 * Usage: node scripts/check-assets.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = new URL(".", import.meta.url).pathname;
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const srcDir = join(root, "src");

const EXCLUDE_DIRS = new Set(["node_modules", "dist", "archive", ".git"]);

function walkFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (EXCLUDE_DIRS.has(entry)) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) results.push(...walkFiles(full));
    else if (stat.isFile()) results.push(full);
  }
  return results;
}

// Get all public assets
const publicAssets = new Set();
if (existsSync(publicDir)) {
  for (const f of walkFiles(publicDir)) {
    publicAssets.add(f.replace(publicDir, ""));
  }
}

// Find references to /public paths in source
const files = walkFiles(srcDir).filter(f => [".tsx", ".ts", ".html"].includes(extname(f)));

const missing = [];
let checked = 0;

// Pattern: href="/something.ext" or src="/something.ext" for known asset extensions
const assetPattern = /["'](\/[^\s"']+\.(png|jpg|jpeg|svg|gif|webp|ico|json|pdf|woff|woff2|ttf|otf))["']/g;

for (const file of files) {
  const content = readFileSync(file, "utf8");
  let match;
  while ((match = assetPattern.exec(content)) !== null) {
    const assetPath = match[1];
    checked++;
    if (!publicAssets.has(assetPath)) {
      missing.push({ file: file.replace(root + "/", ""), asset: assetPath });
    }
  }
}

// Also check index.html explicitly
const indexHtml = join(root, "index.html");
if (existsSync(indexHtml)) {
  const content = readFileSync(indexHtml, "utf8");
  let match;
  while ((match = assetPattern.exec(content)) !== null) {
    const assetPath = match[1];
    checked++;
    if (!publicAssets.has(assetPath)) {
      missing.push({ file: "index.html", asset: assetPath });
    }
  }
}

const deduped = [...new Map(missing.map(m => [m.asset, m])).values()];

console.log(`\n📁 check:assets — checked ${checked} asset reference(s) against public/\n`);
console.log(`   Public assets present: ${[...publicAssets].join(", ")}\n`);

if (deduped.length === 0) {
  console.log("✅ All referenced local assets exist in public/.");
  process.exit(0);
} else {
  console.log(`❌ ${deduped.length} referenced asset(s) not found in public/:\n`);
  for (const m of deduped) console.log(`   ${m.asset}  (referenced in ${m.file})`);
  process.exit(1);
}
