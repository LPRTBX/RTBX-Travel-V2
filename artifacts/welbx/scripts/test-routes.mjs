#!/usr/bin/env node
/**
 * test-routes.mjs
 * Verifies that every component referenced in App.tsx route table
 * has a corresponding source file.
 *
 * Usage: node scripts/test-routes.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const appTsx = join(root, "src", "App.tsx");

const content = readFileSync(appTsx, "utf8");

// Extract all import statements with their paths
const importRegex = /import\s+\w+\s+from\s+["'](@\/[^"']+|\.{1,2}\/[^"']+)["']/g;
let match;
const imports = [];
while ((match = importRegex.exec(content)) !== null) {
  imports.push(match[1]);
}

let failures = 0;
let passed = 0;
const results = [];

for (const imp of imports) {
  // Resolve @/ alias to src/
  const resolved = imp.startsWith("@/")
    ? join(root, "src", imp.slice(2))
    : join(root, imp);

  // Try with .tsx, .ts extensions
  const candidates = [resolved, `${resolved}.tsx`, `${resolved}.ts`, `${resolved}/index.tsx`];
  const exists = candidates.some(c => existsSync(c));

  if (!exists) {
    results.push({ status: "MISSING", import: imp });
    failures++;
  } else {
    results.push({ status: "OK", import: imp });
    passed++;
  }
}

console.log(`\n📋 test:routes — ${passed} imports resolved, ${failures} missing\n`);

const missing = results.filter(r => r.status === "MISSING");
if (missing.length > 0) {
  console.log("❌ Missing imports:");
  for (const m of missing) console.log(`   ${m.import}`);
  process.exit(1);
} else {
  console.log("✅ All App.tsx imports resolve to existing files.");
  process.exit(0);
}
