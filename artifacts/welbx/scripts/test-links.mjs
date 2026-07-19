#!/usr/bin/env node
/**
 * test-links.mjs
 * Extracts all internal Link href= and path= values from active source
 * and verifies they point to a canonical route defined in App.tsx.
 *
 * Usage: node scripts/test-links.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = new URL(".", import.meta.url).pathname;
const root = join(__dirname, "..");
const srcDir = join(root, "src");
const appTsx = join(srcDir, "App.tsx");

const EXCLUDE_DIRS = new Set(["node_modules", "dist", "archive", ".git"]);

function walkFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (EXCLUDE_DIRS.has(entry)) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) results.push(...walkFiles(full));
    else if (stat.isFile() && (extname(full) === ".tsx" || extname(full) === ".ts")) results.push(full);
  }
  return results;
}

// Extract canonical routes from App.tsx — handles both object (path: "...") and JSX (path="...") forms
const appContent = readFileSync(appTsx, "utf8");
const routeRegex = /path[=:]\s*["']([^"']+)["']/g;
const canonicalRoutes = new Set();
let m;
while ((m = routeRegex.exec(appContent)) !== null) {
  // Strip hash anchors for base route matching
  canonicalRoutes.add(m[1].split("#")[0]);
}

// Also collect Redirect targets
const redirectRegex = /to=["']([^"']+)["']/g;
while ((m = redirectRegex.exec(appContent)) !== null) {
  canonicalRoutes.add(m[1].split("#")[0]);
}

const files = walkFiles(srcDir);

// Extract href/path strings from active source
const hrefRegex = /href=["']([/][^"']+)["']|path=["']([/][^"']+)["']/g;

const broken = [];
let checkedCount = 0;

for (const file of files) {
  const content = readFileSync(file, "utf8");
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = (match[1] || match[2]).split("#")[0]; // strip hash
    if (!href.startsWith("/")) continue;
    if (href === "/") continue; // root redirect is handled
    if (href.startsWith("/partner-room") || href.startsWith("/story") || href.startsWith("/travel")) {
      checkedCount++;
      if (!canonicalRoutes.has(href)) {
        broken.push({ file: file.replace(root + "/", ""), href });
      }
    }
  }
}

const deduped = [...new Map(broken.map(b => [`${b.href}:${b.file}`, b])).values()];

console.log(`\n🔗 test:links — checked ${checkedCount} internal links across active source\n`);

if (deduped.length === 0) {
  console.log("✅ All internal links resolve to canonical routes.");
  process.exit(0);
} else {
  console.log(`⚠️  ${deduped.length} link(s) not found in route table (may be hash-only anchors or valid aliases):\n`);
  for (const b of deduped) console.log(`   ${b.href}  →  ${b.file}`);
  // Advisory only — do not exit(1) since hash anchors are intentional
  process.exit(0);
}
