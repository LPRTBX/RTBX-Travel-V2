// Verifies the sibling Core checkout is exactly the pinned, clean commit and exports the pinned contract version.
// Read-only. Usage: node check-core-pin.mjs [path-to-core]   (default: JALDO_CORE_DIR, else ../../../../rtbx-main)
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pin = JSON.parse(readFileSync(resolve(here, "core-pin.json"), "utf8"));
export const coreDir = resolve(process.argv[2] ?? process.env.JALDO_CORE_DIR ?? resolve(here, pin.defaultRelativePath));

export function checkCorePin(dir = coreDir) {
  const git = (...a) => execFileSync("git", ["-C", dir, ...a], { encoding: "utf8" }).trim();
  let head, dirty;
  try { head = git("rev-parse", "HEAD"); dirty = git("status", "--porcelain", "--", "lib/jaldo-orchestration"); }
  catch { return { ok: false, reason: `no Core checkout at ${dir}` }; }
  if (head !== pin.commit) return { ok: false, reason: `Core is at ${head}, pinned ${pin.commit}` };
  if (dirty) return { ok: false, reason: "Core's orchestration package has local modifications" };
  const declared = readFileSync(resolve(dir, "lib/jaldo-orchestration/src/version.ts"), "utf8").match(/CONTRACT_VERSION\s*=\s*"([^"]+)"/)?.[1];
  if (declared !== pin.contractVersion) return { ok: false, reason: `contract ${declared}, pinned ${pin.contractVersion}` };
  return { ok: true, commit: head, contractVersion: declared };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = checkCorePin();
  if (!r.ok) { console.error(`FAIL ${r.reason}`); process.exit(1); }
  console.log(`PASS Core ${r.commit.slice(0, 7)} clean; contract ${r.contractVersion}`);
}
