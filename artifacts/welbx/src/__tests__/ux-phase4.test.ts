import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  PORTFOLIO_ACTORS, PORTFOLIO_EXCEPTIONS, PORTFOLIO_PROPERTIES, decideException, newExceptionRecord, pendingApprovers,
} from "@/lib/portfolioCoordination";
import {
  CERTIFICATION_STATEMENT, DEMONSTRATED_BEHAVIOUR, PILOT_SECURITY_REQUIREMENTS, VERIFIED_CONTROLS,
} from "@/data/securityPosture";
import {
  ENQUIRY_ADDRESS, MAILTO_BODY_LIMIT, defaultPilotScope, integrationPrerequisites, pilotCommercialAssumptions,
  requiredRoles, scopeGaps, scopeMailto, scopeSummary, type PilotScope,
} from "@/lib/pilotScope";

const exceptionById = (id: string) => PORTFOLIO_EXCEPTIONS.find(item => item.id === id)!;

describe("Stage 3 portfolio coordination", () => {
  it("has several distinct properties, each with its own accountable people", () => {
    expect(PORTFOLIO_PROPERTIES.length).toBeGreaterThanOrEqual(3);
    expect(new Set(PORTFOLIO_PROPERTIES.map(p => p.type)).size).toBe(PORTFOLIO_PROPERTIES.length);
    for (const property of PORTFOLIO_PROPERTIES) {
      for (const item of property.cases) {
        expect(PORTFOLIO_ACTORS.find(actor => actor.id === item.ownerId)?.propertyId, `${property.name}: ${item.title}`).toBe(property.id);
      }
    }
  });

  it("refuses a decision from anyone without authority and leaves the record unchanged", () => {
    const exception = exceptionById("pattern-room-readiness");
    const record = newExceptionRecord(exception.id);
    expect(() => decideException(exception, record, "dm-harbour", "approve")).toThrow(/has no authority/);
    expect(record).toEqual(newExceptionRecord(exception.id));
    expect(decideException(exception, record, "regional-ops", "approve").status).toBe("approved");
  });

  it("needs every listed approval for a move between properties", () => {
    const exception = exceptionById("authority-cross-property-move");
    let record = decideException(exception, newExceptionRecord(exception.id), "regional-ops", "approve");
    expect(record.status).toBe("awaiting");
    expect(pendingApprovers(exception, record)).toEqual(["gm-coastal"]);
    expect(() => decideException(exception, record, "regional-ops", "approve")).toThrow(/already approved/);
    record = decideException(exception, record, "gm-coastal", "approve");
    expect(record.status).toBe("approved");
    expect(() => decideException(exception, record, "gm-coastal", "return", "Changed my mind entirely")).toThrow(/already been decided/);
  });

  it("requires a meaningful reason to return", () => {
    const exception = exceptionById("pattern-room-readiness");
    expect(() => decideException(exception, newExceptionRecord(exception.id), "regional-ops", "return", "   no  ")).toThrow(/reason/);
    const returned = decideException(exception, newExceptionRecord(exception.id), "regional-ops", "return", "Housekeeping data is incomplete today");
    expect(returned).toMatchObject({ status: "returned", entries: [{ actorId: "regional-ops", action: "returned" }] });
  });

  it("never lets the portfolio decide a welfare case", () => {
    const exception = exceptionById("welfare-bayside");
    expect(exception.requiredApproverIds).toEqual([]);
    for (const actor of PORTFOLIO_ACTORS) {
      expect(() => decideException(exception, newExceptionRecord(exception.id), actor.id, "approve")).toThrow(/Welfare cases stay with Duty Manager · Bayside Holiday Park/);
    }
  });
});

describe("Security and data claims", () => {
  it("backs every verified control with an automated check, and only those", () => {
    for (const item of VERIFIED_CONTROLS) expect(item.evidence, item.title).toBeTruthy();
    for (const item of [...DEMONSTRATED_BEHAVIOUR, ...PILOT_SECURITY_REQUIREMENTS]) expect(item.evidence, item.title).toBeUndefined();
  });

  it("claims no certification or compliance", () => {
    expect(CERTIFICATION_STATEMENT).toMatch(/makes no certification claim/);
    const claims = [...VERIFIED_CONTROLS, ...DEMONSTRATED_BEHAVIOUR].map(item => `${item.title} ${item.detail} ${item.evidence ?? ""}`).join(" ");
    expect(claims).not.toMatch(/\b(certified|compliant|ISO ?27001|SOC ?2|GDPR[- ]compliant|PCI)\b/i);
  });

  it("keeps the 'no data leaves the browser' claim true: the app's source makes no network calls", () => {
    const sources = (dir: string): string[] => readdirSync(dir).flatMap(name => {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) return name === "__tests__" ? [] : sources(full);
      return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [full] : [];
    });
    const calls = /\bfetch\s*\(|new\s+XMLHttpRequest\b|new\s+WebSocket\b|new\s+EventSource\b|\.sendBeacon\s*\(/;
    const offenders = sources(join(process.cwd(), "src")).filter(file => calls.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });
});

describe("Pilot scope", () => {
  const filled = (properties: string[]): PilotScope => {
    const scope = defaultPilotScope();
    scope.properties = properties.map(name => ({ name, type: "Hotel", rooms: "120" }));
    for (const role of requiredRoles(scope)) scope.people[role.id] = `Named ${role.label}`;
    scope.review.criteria = "Acknowledgement time improves on the baseline";
    return scope;
  };

  it("lists what is still to agree, and nothing once complete", () => {
    expect(scopeGaps(defaultPilotScope())).toEqual(expect.arrayContaining(["Name at least one property", "Name the executive sponsor"]));
    expect(scopeGaps(filled(["Harbour Hotel"]))).toEqual([]);
  });

  it("adds a portfolio exception owner when the pilot covers more than one property", () => {
    const one = filled(["Harbour Hotel"]);
    expect(requiredRoles(one).map(role => role.id)).not.toContain("portfolioOwner");
    const two = { ...one, properties: [...one.properties, { name: "Coastal Resort", type: "Resort", rooms: "140" }] };
    expect(scopeGaps(two)).toEqual(["Name the portfolio exception owner"]);
  });

  it("derives integration prerequisites from the selected moments", () => {
    expect(integrationPrerequisites(["repeat-guest-room-not-ready"]).map(p => p.title)).toEqual(["Property Management Systems", "Housekeeping Platforms", "Guest Messaging"]);
    expect(integrationPrerequisites([])).toEqual([]);
  });

  it("labels commercial assumptions as unapproved and the value as modelled", () => {
    const assumptions = pilotCommercialAssumptions();
    expect(assumptions.length).toBeGreaterThan(0);
    for (const item of assumptions) expect(item.status).not.toMatch(/^Approved/);
    const summary = scopeSummary(filled(["Harbour Hotel"]), { sites: 1, roomsPerSite: 120, lowMonthly: 1000, baseMonthly: 2000, highMonthly: 4000, costIncluded: false });
    expect(summary).toMatch(/SUBJECT TO PROPOSAL, NOT A QUOTE/);
    expect(summary).toMatch(/VALUE HYPOTHESIS \(MODELLED, NOT A FORECAST\)/);
    expect(summary).toMatch(/\$1,000 \/ \$2,000 \/ \$4,000 .*programme cost not included/);
    expect(summary).toMatch(/nothing has been agreed or sent/);
  });

  it("builds an email draft for the visitor's own app, shortened when long", () => {
    const short = scopeMailto("Short scope");
    expect(short.href.startsWith(`mailto:${ENQUIRY_ADDRESS}?subject=`)).toBe(true);
    expect(decodeURIComponent(short.href.split("body=")[1])).toBe("Short scope");
    const long = scopeMailto("x".repeat(MAILTO_BODY_LIMIT + 50));
    expect(long.truncated).toBe(true);
    expect(decodeURIComponent(long.href.split("body=")[1])).toMatch(/Shortened to fit an email link/);
  });
});
