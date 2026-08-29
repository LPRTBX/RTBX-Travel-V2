#!/usr/bin/env node
/**
 * test-links.mjs
 * Extracts all internal Link href= and path= values from active source
 * and verifies they point to a canonical route defined in App.tsx.
 * Also validates hash anchors against a whitelist of known approved IDs.
 *
 * Usage: node scripts/test-links.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const __dirname = new URL(".", import.meta.url).pathname;
const root = join(__dirname, "..");
const srcDir = join(root, "src");
const appTsx = join(srcDir, "App.tsx");

const EXCLUDE_DIRS = new Set(["node_modules", "dist", "archive", ".git"]);
const INTERNAL_SOURCE_FILES = new Set([
  "Sidebar.tsx",
  "StoryHub.tsx",
  "StoryOperator.tsx",
  "StoryGuestStory.tsx",
  "PartnerCommercialModel.tsx",
  "PartnerCommercialUnit.tsx",
  "TravelBusinessPlan.tsx",
  "TravelGtmPlan.tsx",
  "TravelRevenueModel.tsx",
  "TravelCommercialCase.tsx",
  "TravelCommercialPartnershipBrief.tsx",
]);

function walkFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (EXCLUDE_DIRS.has(entry)) continue;
    if (INTERNAL_SOURCE_FILES.has(entry)) continue;
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

// ── Known valid hash anchors ──────────────────────────────────────────────────
// Anchors that resolve to real DOM sections (either static IDs or dynamically
// rendered but always-present in the target page). Update this list when new
// anchored sections are added.
const APPROVED_HASHES = new Set([
  // Partner Ecosystem
  "integration-responsibility",
  // Pilot Model
  "readiness-checklist",
  // Landing page
  "proof-layers",
  "environments",
  "partner-paths",
  // Outcome ledger section
  "outcome-ledger",
  // Operating model sections
  "signal-layer",
  "intelligence-layer",
  "action-layer",
  "assurance-layer",
  "learning-layer",
  // Product proof sections
  "demo",
  "evidence",
  "outcomes",
  "communications",
  // Commercial sections
  "pricing",
  "model",
  // Pilot model sections
  "pilot-design",
]);

const files = walkFiles(srcDir);

// Extract href/path strings including hash from active source
const hrefRegex = /href=["']([/][^"'\s]+)["']|path=["']([/][^"'\s]+)["']/g;

const brokenRoutes = [];
const unknownHashes = [];
let checkedCount = 0;

for (const file of files) {
  const content = readFileSync(file, "utf8");
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const full = match[1] || match[2];
    if (!full.startsWith("/")) continue;
    if (full === "/") continue;

    const [pathAndQuery, hash] = full.split("#");
    const basePath = pathAndQuery.split("?")[0];

    const isPartnerRoomPath = basePath.startsWith("/partner-room") || basePath.startsWith("/story") || basePath.startsWith("/travel");
    if (!isPartnerRoomPath) continue;

    checkedCount++;

    // Check base route exists
    const routeExists = [...canonicalRoutes].some(route => {
      if (route === basePath) return true;
      if (!route.includes(":")) return false;
      const pattern = new RegExp(`^${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/:[^/]+/g, "[^/]+")}$`);
      return pattern.test(basePath);
    });
    if (!routeExists) {
      brokenRoutes.push({ file: file.replace(root + "/", ""), href: full });
    }

    // Check hash anchor if present
    if (hash && !APPROVED_HASHES.has(hash)) {
      unknownHashes.push({ file: file.replace(root + "/", ""), href: full, hash });
    }
  }
}

const dedupedRoutes  = [...new Map(brokenRoutes.map(b => [`${b.href}:${b.file}`, b])).values()];
const dedupedHashes  = [...new Map(unknownHashes.map(b => [`${b.hash}:${b.file}`, b])).values()];

console.log(`\n🔗 test:links — checked ${checkedCount} internal links across active source\n`);

let exitCode = 0;

if (dedupedRoutes.length === 0) {
  console.log("✅ All internal base routes resolve to canonical routes.");
} else {
  console.log(`❌ ${dedupedRoutes.length} base route(s) not found in route table:\n`);
  for (const b of dedupedRoutes) console.log(`   ${b.href}  →  ${b.file}`);
  exitCode = 1;
}

if (dedupedHashes.length === 0) {
  console.log("✅ All hash anchors are in the approved list.");
} else {
  console.log(`\n⚠️  ${dedupedHashes.length} hash anchor(s) not in approved list (advisory):\n`);
  for (const b of dedupedHashes) {
    console.log(`   #${b.hash}  →  ${b.file}`);
  }
  console.log("\n  Add confirmed IDs to APPROVED_HASHES in test-links.mjs if they resolve correctly.");
  // Hash mismatches are advisory — do not fail the check
}

process.exit(exitCode);
