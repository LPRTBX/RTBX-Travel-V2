#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = join(new URL(".", import.meta.url).pathname, "..");
const srcRoot = join(root, "src");
const appPath = join(srcRoot, "App.tsx");
const app = readFileSync(appPath, "utf8");
const manifest = readFileSync(join(root, "src", "pages", "partner-room", "PartnerBriefLibrary.tsx"), "utf8");
const gate = readFileSync(join(root, "src", "components", "PartnerAccessGate.tsx"), "utf8");

const forbiddenSourceFiles = [
  "pages/partner-room/PartnerCommercialUnit.tsx",
  "pages/partner-room/PartnerCommercialModel.tsx",
  "pages/StoryHub.tsx",
  "pages/StoryOperator.tsx",
  "pages/StoryGuestStory.tsx",
  "pages/partner-room/resources/TravelBusinessPlan.tsx",
  "pages/partner-room/resources/TravelGtmPlan.tsx",
  "pages/partner-room/resources/TravelRevenueModel.tsx",
  "pages/partner-room/resources/TravelCommercialCase.tsx",
  "pages/partner-room/resources/TravelCommercialPartnershipBrief.tsx",
];

const approvedRoutes = [
  "/partner-room",
  "/partner-room/overview",
  "/partner-room/deployments",
  "/partner-room/product-proof",
  "/partner-room/validation",
  "/partner-room/commercial",
  "/partner-room/brief-library",
  "/partner-room/next-step",
  "/partner-room/operator-brief",
  "/partner-room/integration-brief",
  "/partner-room/moments-economy",
  "/partner-room/signals-engine",
  "/partner-room/pilot-model",
  "/partner-room/commercial-model",
  "/partner-room/demo-paths",
  "/partner-room/live-demos",
  "/partner-room/guest-demo",
  "/partner-room/operator-demo",
  "/partner-room/dual-view-demo",
  "/partner-room/holiday-park-demo",
  "/partner-room/deployments/hotels-resorts/demo",
  "/partner-room/deployments/corporate-travel/demo",
  "/partner-room/deployments/events-venues/demo",
  "/partner-room/deployments/destination-tourism/demo",
  "/partner-room/scenario-builder",
  "/partner-room/proof-calculator",
  "/partner-room/comms-demo",
  "/partner-room/travel-ai-comms",
  "/travel-ai-comms",
  "/partner-room/decision-spine",
  "/partner-room/validation-replay",
  "/partner-room/product-proof/signal-capture",
  "/partner-room/product-proof/stage-3-operating-layer",
  "/partner-room/product-proof/pilot-expansion-preview",
  "/partner-room/operating-model",
  "/partner-room/intelligence-model",
  "/partner-room/travel-intelligence",
  "/travel-intelligence",
  "/partner-room/travel-operating-systems",
  "/travel-operating-systems",
  "/travel-action-centre",
  "/travel-outcomes",
  "/travel-value",
  "/partner-room/build-configure",
  "/partner-room/operations",
  "/partner-room/travel-scenarios/:scenarioId",
  "/partner-room/travel-scenarios",
  "/travel-scenarios/:scenarioId",
  "/travel-scenarios",
  "/partner-room/rollout-model",
  "/partner-room/partner-ecosystem",
  "/partner-room/resources/travel-partnership-overview",
  "/partner-room/resources/travel-ux-blueprint",
  "/partner-room/resources/travel-systems-map",
  "/partner-room/resources/travel-pilot-model",
  "/partner-room/resources/travel-demo-links",
  "/partner-room/resources/travel-ai-intelligence-layer",
  "/partner-room/resources/travel-architecture-modelling-ux-qa",
];

const failures = [];

function resolveSourceImport(fromFile, specifier) {
  if (!specifier.startsWith("@/") && !specifier.startsWith(".")) return null;
  const unresolved = specifier.startsWith("@/")
    ? join(srcRoot, specifier.slice(2))
    : resolve(dirname(fromFile), specifier);
  const candidates = [
    unresolved,
    `${unresolved}.ts`,
    `${unresolved}.tsx`,
    join(unresolved, "index.ts"),
    join(unresolved, "index.tsx"),
  ];
  return candidates.find(candidate => existsSync(candidate) && statSync(candidate).isFile()) ?? null;
}

function collectImportGraph(entryFile) {
  const visited = new Set();
  const pending = [entryFile];
  const importPattern = /(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g;

  while (pending.length > 0) {
    const file = pending.pop();
    if (!file || visited.has(file)) continue;
    visited.add(file);
    const content = readFileSync(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const resolvedImport = resolveSourceImport(file, match[1]);
      if (resolvedImport && !visited.has(resolvedImport)) pending.push(resolvedImport);
    }
  }
  return visited;
}

const activeImportGraph = collectImportGraph(appPath);
for (const forbiddenFile of forbiddenSourceFiles) {
  const absolutePath = join(srcRoot, forbiddenFile);
  if (activeImportGraph.has(absolutePath)) {
    failures.push(`External import graph reaches restricted source: ${forbiddenFile}`);
  }
}

const actualRoutes = [
  ...app.matchAll(/path\s*(?::|=)\s*["']([^"']+)["']/g),
].map(match => match[1]);
for (const route of actualRoutes) {
  if (!approvedRoutes.includes(route)) failures.push(`Unclassified external route is registered: ${route}`);
}
for (const route of approvedRoutes) {
  if (!actualRoutes.includes(route)) failures.push(`Approved route is missing from App.tsx: ${route}`);
}

const manifestStart = manifest.indexOf("export const EXTERNAL_PARTNER_RESOURCES");
const manifestEnd = manifest.indexOf("const DISPLAYABLE_DOCS", manifestStart);
const manifestBlock = manifest.slice(manifestStart, manifestEnd);

if (manifestStart < 0 || manifestEnd < 0) {
  failures.push("Canonical external resource manifest was not found");
} else {
  if (/accessLevel:\s*["'](?:internal-only|commercially-restricted)["']/.test(manifestBlock)) {
    failures.push("External resource manifest includes an internal or commercially restricted entry");
  }

  const hrefs = [...manifestBlock.matchAll(/href:\s*["']([^"']+)["']/g)].map(match => match[1]);
  for (const href of hrefs) {
    const path = href.split("#")[0];
    if (!app.includes(`path: "${path}"`)) failures.push(`Manifest route is not registered externally: ${href}`);
  }
}

if (!gate.includes("Controlled Partner Preview")) failures.push("Access gate is missing controlled-preview wording");
if (!gate.includes("not a production security boundary")) failures.push("Access gate does not disclose its advisory boundary");
if (gate.includes("Private Partner Room")) failures.push("Access gate still makes a private-room claim");

function walkFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walkFiles(path) : [path];
  });
}

const approvedPublicFiles = new Set(["favicon.svg", "opengraph.jpg"]);
for (const publicFile of walkFiles(join(root, "public"))) {
  const publicPath = relative(join(root, "public"), publicFile);
  if (!approvedPublicFiles.has(publicPath)) failures.push(`Unclassified public/downloadable file: public/${publicPath}`);
}

if (failures.length > 0) {
  console.error("\n❌ Access-boundary check failed:\n");
  for (const failure of failures) console.error(`   - ${failure}`);
  process.exit(1);
}

console.log(`\n✅ ${actualRoutes.length} approved routes, ${activeImportGraph.size} active source modules, the resource manifest, gate wording, and public files satisfy the access boundary.`);