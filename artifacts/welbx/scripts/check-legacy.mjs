#!/usr/bin/env node
/**
 * check-legacy.mjs
 * Fails if the retired guest brand appears anywhere in active source.
 * Historical source in src/archive/ is excluded.
 *
 * Usage: node scripts/check-legacy.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const RETIRED_TERM = /welbx/i;

const ACTIVE_EXTENSIONS = new Set([".tsx", ".ts", ".js", ".mjs", ".html", ".json"]);
const EXCLUDE_DIRS = new Set(["node_modules", "dist", "archive", ".git"]);

function walkFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (EXCLUDE_DIRS.has(entry)) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) results.push(...walkFiles(full));
    else if (stat.isFile() && ACTIVE_EXTENSIONS.has(extname(full))) results.push(full);
  }
  return results;
}

const root = new URL("..", import.meta.url).pathname;
const srcDir = join(root, "src");
const files = walkFiles(srcDir);

const findings = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (RETIRED_TERM.test(line)) {
      findings.push({ file: file.replace(root, ""), line: i + 1, content: line.trim().slice(0, 100) });
    }
  }
}

if (findings.length === 0) {
  console.log("✅ check:terminology — no retired guest-brand references found in active source.");
  process.exit(0);
}

console.log(`\n❌ check:terminology — found ${findings.length} retired guest-brand reference(s):\n`);
for (const f of findings) {
  console.log(`  ${f.file}:${f.line}`);
  console.log(`           ${f.content}`);
}

console.log(`\nFix all ${findings.length} reference(s) before merging.`);
process.exit(1);
