#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(new URL(".", import.meta.url).pathname, "..");
const dist = join(root, "dist");

if (!existsSync(dist)) {
  console.error("❌ dist/ is missing. Run the production build before the bundle-boundary check.");
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(dist);
const searchableFiles = files.filter(path => /\.(?:js|css|html|json|txt|map)$/i.test(path));
const bundleText = searchableFiles.map(path => readFileSync(path, "utf8")).join("\n");
const fileNames = files.join("\n");
// Public marketing imagery only; keep every other unclassified asset blocked.
const approvedNonTextAssets = new Set(["favicon.svg", "opengraph.jpg",
  "brand/jaldo-logo-white.webp",
  "images/travel/arrival-hero.webp",
  "images/travel/team-coordination.webp",
]);

const forbiddenModuleNames = [
  "TravelBusinessPlan",
  "TravelGtmPlan",
  "TravelRevenueModel",
  "TravelCommercialCase",
  "TravelCommercialPartnershipBrief",
  "PartnerCommercial",
  "PartnerCommercialUnit",
];

const forbiddenContentSentinels = [
  "RTBX Travel — Business Plan",
  "RTBX Travel — Go-To-Market Plan",
  "A$150K–A$450K (10–20 operators)",
  "20–30% revenue share on platform and deployment fees",
  "Oracle Hospitality, Agilysys, Mews, Cloudbeds",
  "Series A or strategic acquirer pathway open",
  "Strategic / Funding Partner",
  "Funders & Investors",
  "Funder / Investor View",
  "RTBX Travel Commercial Pathway",
];

const failures = [
  ...forbiddenModuleNames
    .filter(name => fileNames.includes(name) || bundleText.includes(name))
    .map(name => `restricted module leaked into dist: ${name}`),
  ...forbiddenContentSentinels
    .filter(text => bundleText.includes(text))
    .map(text => `restricted content leaked into dist: ${text}`),
  ...files
    .filter(path => !searchableFiles.includes(path) && !approvedNonTextAssets.has(relative(join(dist, "public"), path)))
    .map(path => `unclassified non-text asset emitted: ${relative(dist, path)}`),
];

if (failures.length > 0) {
  console.error("\n❌ Production bundle boundary check failed:\n");
  for (const failure of failures) console.error(`   - ${failure}`);
  process.exit(1);
}

console.log(`\n✅ Production bundle excludes restricted modules and content (${files.length} files scanned).`);
