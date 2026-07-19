#!/usr/bin/env node
/**
 * check-legacy.mjs
 * Fails if prohibited legacy brand terms appear in active source files.
 * Archived files (src/archive/) are excluded.
 *
 * Usage: node scripts/check-legacy.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const TERMS = ["WELBX", "Welbx", "welbx", "BXOS", "bxos", "NEXUS", "nexus"];

// Terms that are acceptable in specific controlled contexts
const ALLOWED_PATTERNS = [
  // WELBX as the guest-facing layer is an accurate architectural statement
  /WELBX is the guest-facing experience layer/,
  // RTBX brand description referencing WELBX correctly
  /WELBX.*guest.*layer|guest.*layer.*WELBX/i,
  // BXOS/NEXUS as deferred Sprint-2 items in comments
  /Sprint 2|deferred/i,
];

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

let failures = 0;
const findings = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const term of TERMS) {
      if (!line.includes(term)) continue;

      // Check if this is an allowed pattern
      const allowed = ALLOWED_PATTERNS.some(p => p.test(line));
      if (allowed) continue;

      // Comments and JSDoc are advisory, not blocking (but still reported)
      const isComment = line.trim().startsWith("//") || line.trim().startsWith("*") || line.trim().startsWith("/*");

      findings.push({ file: file.replace(root, ""), line: i + 1, term, content: line.trim().slice(0, 100), isComment });
      if (!isComment) failures++;
    }
  }
}

if (findings.length === 0) {
  console.log("✅ check:legacy — no prohibited legacy terms found in active source.");
  process.exit(0);
}

console.log(`\n⚠️  check:legacy — found ${findings.length} legacy term occurrence(s):\n`);
for (const f of findings) {
  const prefix = f.isComment ? "  [comment]" : "  [ACTIVE] ";
  console.log(`${prefix} ${f.file}:${f.line}  (${f.term})`);
  console.log(`           ${f.content}`);
}

if (failures > 0) {
  console.log(`\n❌ ${failures} active (non-comment) legacy term(s) found. Fix before merging.`);
  process.exit(1);
} else {
  console.log(`\n⚠️  Legacy terms found in comments only — advisory, not blocking.`);
  process.exit(0);
}
