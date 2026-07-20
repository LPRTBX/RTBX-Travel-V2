/**
 * PartnerBriefLibrary.tsx — Sprint 5
 *
 * Resource library with audience, owner, version, confidentiality, maturity
 * and last-reviewed date on every document.
 *
 * Classifications: General partner / Pilot partner / Technical partner /
 * Deployment partner / Commercially restricted / Internal only.
 *
 * Internal-only and sensitive commercial documents are not exposed through
 * unsecured general navigation.
 */

import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)", gold: "#c9a84c", green: "#10b981", blue: "#3b82f6" };

type DocClassification = "general-partner" | "pilot-partner" | "technical-partner" | "deployment-partner" | "commercially-restricted" | "internal-only";
type DocMaturity = "draft" | "working" | "review" | "approved" | "archived";

type ResourceDoc = {
  id: string;
  title: string;
  description: string;
  audience: string[];
  owner: string;
  version: string;
  confidentiality: DocClassification;
  maturity: DocMaturity;
  lastReviewed: string;
  commercialStatus?: string;
  href?: string;
  tags: string[];
};

const CLASSIFICATION_LABELS: Record<DocClassification, string> = {
  "general-partner":         "General partner",
  "pilot-partner":           "Pilot partner",
  "technical-partner":       "Technical partner",
  "deployment-partner":      "Deployment partner",
  "commercially-restricted": "Commercially restricted",
  "internal-only":           "Internal only",
};

const CLASSIFICATION_COLORS: Record<DocClassification, string> = {
  "general-partner":         "#10b981",
  "pilot-partner":           "#c9a84c",
  "technical-partner":       "#3b82f6",
  "deployment-partner":      "#a78bfa",
  "commercially-restricted": "#f97316",
  "internal-only":           "#ef4444",
};

const MATURITY_COLORS: Record<DocMaturity, string> = {
  "draft":    "rgba(255,255,255,0.3)",
  "working":  "#3b82f6",
  "review":   "#c9a84c",
  "approved": "#10b981",
  "archived": "rgba(255,255,255,0.2)",
};

const RESOURCE_DOCS: ResourceDoc[] = [
  // General partner resources
  {
    id: "doc-partner-overview",
    title: "RTBX Travel Partner Overview",
    description: "Introduction to the RTBX Travel ecosystem, what RTBX owns, partner lanes and partnership pathway. Suitable for initial partner conversations.",
    audience: ["All partner types", "Prospective partners"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "general-partner",
    maturity: "working",
    lastReviewed: "July 2025",
    href: "/partner-room/partner-ecosystem",
    tags: ["ecosystem", "overview", "partner-lanes"],
  },
  {
    id: "doc-pilot-model",
    title: "Hotel Pilot Model",
    description: "Canonical pilot proposition, operating systems, scenarios, delivery stages and success framework for the Hotel Moment Response and Service Recovery Pilot.",
    audience: ["Hotel operators", "General Managers", "COO", "Transformation leads"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "pilot-partner",
    maturity: "working",
    lastReviewed: "July 2025",
    href: "/partner-room/pilot-model",
    tags: ["pilot", "hotel", "scenarios", "success-framework"],
  },
  {
    id: "doc-operating-model",
    title: "RTBX Travel Operating Model",
    description: "Intelligence engine, six intelligence layers, travel operating systems and Connect → Understand → Decide → Act → Learn framework.",
    audience: ["All partners", "Hotel operators", "Technology partners"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "general-partner",
    maturity: "working",
    lastReviewed: "July 2025",
    href: "/partner-room/operating-model",
    tags: ["architecture", "intelligence-engine", "operating-model"],
  },
  {
    id: "doc-deployment-environments",
    title: "RTBX Travel Deployment Environments",
    description: "Primary, secondary and future deployment environments. Hotels and resorts as the initial market. Expansion pathway to hotel groups, holiday parks and other environments.",
    audience: ["All partners", "Hotel operators", "Distribution partners"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "general-partner",
    maturity: "working",
    lastReviewed: "July 2025",
    href: "/partner-room/deployments",
    tags: ["deployments", "environments", "hotels"],
  },
  // Pilot partner resources
  {
    id: "doc-readiness-checklist",
    title: "Pilot Readiness Checklist",
    description: "Interactive readiness assessment covering customer, technical, operational and measurement readiness. Used during the Align stage.",
    audience: ["Pilot owner", "General Manager", "Technology lead"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "pilot-partner",
    maturity: "working",
    lastReviewed: "July 2025",
    href: "/partner-room/pilot-model#readiness-checklist",
    tags: ["pilot", "readiness", "checklist"],
  },
  {
    id: "doc-success-measures",
    title: "Pilot Success Framework",
    description: "Operational, guest, staff, governance and value measures with target type classification. Measures to be agreed during alignment — no invented results.",
    audience: ["Executive sponsor", "COO", "Pilot owner"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "pilot-partner",
    maturity: "working",
    lastReviewed: "July 2025",
    href: "/partner-room/pilot-model#success-framework",
    tags: ["pilot", "success-measures", "outcomes"],
  },
  {
    id: "doc-build-configure",
    title: "Build & Configure — Working Demonstration",
    description: "Interactive 9-stage deployment configuration environment. Demonstrates how RTBX Travel is configured before execution.",
    audience: ["Pilot owner", "Technology lead", "Operations lead"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "general-partner",
    maturity: "working",
    lastReviewed: "July 2025",
    href: "/partner-room/build-configure",
    tags: ["demo", "configure", "deployment"],
  },
  {
    id: "doc-execution-centre",
    title: "Execution Centre — Working Demonstration",
    description: "End-to-end scenario execution demonstration. Signal-to-outcome trace with operator, guest and dual view.",
    audience: ["All partners", "Operations team", "Pilot evaluators"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "general-partner",
    maturity: "working",
    lastReviewed: "July 2025",
    href: "/partner-room/operations",
    tags: ["demo", "execution", "scenarios"],
  },
  // Technical partner resources
  {
    id: "doc-integration-responsibility",
    title: "Integration Responsibility Matrix",
    description: "Signal sources, interface types, authentication ownership, mapping ownership, failure responsibility and maturity classification for all supported integrations.",
    audience: ["Technology partners", "Systems integrators", "IT leaders"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "technical-partner",
    maturity: "working",
    lastReviewed: "July 2025",
    href: "/partner-room/partner-ecosystem#integration-responsibility",
    tags: ["integration", "technical", "responsibility"],
  },
  {
    id: "doc-signal-capture",
    title: "Signal-to-Action Pipeline",
    description: "Technical demonstration of signal capture, context assembly, decision processing and action coordination.",
    audience: ["Technology partners", "CTO", "IT leads"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "technical-partner",
    maturity: "working",
    lastReviewed: "July 2025",
    href: "/partner-room/product-proof/signal-capture",
    tags: ["technical", "signal", "pipeline"],
  },
  {
    id: "doc-travel-intelligence",
    title: "Travel Intelligence Layer",
    description: "Six intelligence layers, signal taxonomy, context model and moment detection approach.",
    audience: ["Technology partners", "Product leads"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "technical-partner",
    maturity: "working",
    lastReviewed: "July 2025",
    href: "/partner-room/travel-intelligence",
    tags: ["technical", "intelligence", "signals"],
  },
  // Deployment partner resources
  {
    id: "doc-deployment-responsibility",
    title: "Deployment Responsibility Matrix",
    description: "Responsibilities across RTBX, customer, technology partner, deployment partner and intervention partner for each stage of deployment.",
    audience: ["Deployment partners", "Systems integrators", "Transformation advisers"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "deployment-partner",
    maturity: "working",
    lastReviewed: "July 2025",
    href: "/partner-room/partner-ecosystem#deployment-responsibility",
    tags: ["deployment", "responsibility", "implementation"],
  },
  {
    id: "doc-rollout-model",
    title: "RTBX Travel Rollout Model",
    description: "Four-stage rollout model from demonstration through pilot, production deployment to scale. Used during planning and client conversations.",
    audience: ["Deployment partners", "Transformation advisers"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "deployment-partner",
    maturity: "working",
    lastReviewed: "July 2025",
    href: "/partner-room/rollout-model",
    tags: ["rollout", "deployment", "scale"],
  },
  // Commercially restricted
  {
    id: "doc-commercial-pathway",
    title: "Commercial Pathway",
    description: "Commercial principles, pilot structure, deployment structure, expansion structure and partner commercial models. All figures are indicative or subject to proposal.",
    audience: ["Commercial leads", "COO", "Executive sponsor"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "commercially-restricted",
    maturity: "working",
    lastReviewed: "July 2025",
    commercialStatus: "Indicative — subject to proposal",
    href: "/partner-room/commercial",
    tags: ["commercial", "pricing", "models"],
  },
  {
    id: "doc-proof-calculator",
    title: "Proof Calculator",
    description: "Indicative tool for modelling potential value. Inputs are transparent, defaults are labelled and outputs are not guaranteed. Customer data replaces assumptions.",
    audience: ["COO", "CFO", "Commercial leads"],
    owner: "RTBX",
    version: "0.5",
    confidentiality: "commercially-restricted",
    maturity: "working",
    lastReviewed: "July 2025",
    commercialStatus: "Indicative assumption — not approved commercial output",
    href: "/partner-room/proof-calculator",
    tags: ["commercial", "value", "calculator"],
  },
];

// Exclude internal-only documents from the displayed list
const DISPLAYABLE_DOCS = RESOURCE_DOCS.filter(d => d.confidentiality !== "internal-only");

const ALL_CLASSIFICATIONS: DocClassification[] = [
  "general-partner", "pilot-partner", "technical-partner", "deployment-partner", "commercially-restricted",
];

export default function PartnerBriefLibrary() {
  const [classFilter, setClassFilter] = useState<DocClassification | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const allTags = Array.from(new Set(DISPLAYABLE_DOCS.flatMap(d => d.tags))).sort();

  const filtered = DISPLAYABLE_DOCS.filter(d =>
    (!classFilter || d.confidentiality === classFilter) &&
    (!tagFilter || d.tags.includes(tagFilter))
  );

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>RTBX Travel · Resource Library</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 14, maxWidth: 760 }}>
            RTBX Travel Brief Library
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 700, marginBottom: 20 }}>
            Classified by audience, owner and confidentiality. Each document shows its version, maturity, last review date and commercial status where applicable. Internal-only documents are not displayed here.
          </p>
          <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 10, color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
            Internal-only and commercially sensitive documents are not exposed through this general library. Contact RTBX directly for access to restricted documents.
          </div>
        </div>

        {/* ── CLASSIFICATION KEY ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 8.5, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>Classification</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <div
              onClick={() => setClassFilter(null)}
              style={{ padding: "5px 12px", fontSize: 9, fontWeight: 700, cursor: "pointer", color: !classFilter ? "#080c14" : "rgba(255,255,255,0.4)", background: !classFilter ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.03)", border: `1px solid ${!classFilter ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.1)"}` }}
            >All</div>
            {ALL_CLASSIFICATIONS.map(cls => (
              <div
                key={cls}
                onClick={() => setClassFilter(classFilter === cls ? null : cls)}
                style={{ padding: "5px 12px", fontSize: 9, fontWeight: 700, cursor: "pointer", color: classFilter === cls ? "#080c14" : CLASSIFICATION_COLORS[cls], background: classFilter === cls ? CLASSIFICATION_COLORS[cls] : "rgba(255,255,255,0.02)", border: `1px solid ${CLASSIFICATION_COLORS[cls]}50` }}
              >{CLASSIFICATION_LABELS[cls]}</div>
            ))}
          </div>
        </div>

        {/* ── TAG FILTER ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 8.5, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>Filter by topic</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <div onClick={() => setTagFilter(null)} style={{ padding: "4px 10px", fontSize: 8.5, cursor: "pointer", color: !tagFilter ? "#fff" : "rgba(255,255,255,0.4)", border: `1px solid ${!tagFilter ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}` }}>All</div>
            {allTags.map(tag => (
              <div key={tag} onClick={() => setTagFilter(tagFilter === tag ? null : tag)} style={{ padding: "4px 10px", fontSize: 8.5, cursor: "pointer", color: tagFilter === tag ? "#fff" : "rgba(255,255,255,0.4)", border: `1px solid ${tagFilter === tag ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.08)"}` }}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* ── DOCUMENT COUNT ── */}
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>
          {filtered.length} of {DISPLAYABLE_DOCS.length} documents shown
        </div>

        {/* ── DOCUMENT LIST ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.map(doc => (
            <div key={doc.id} style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${CLASSIFICATION_COLORS[doc.confidentiality]}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{doc.title}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>
                    Owner: {doc.owner} · Version: {doc.version} · Last reviewed: {doc.lastReviewed} · Maturity:
                    <span style={{ color: MATURITY_COLORS[doc.maturity], fontWeight: 700, marginLeft: 4 }}>{doc.maturity}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ padding: "3px 8px", fontSize: 8, fontWeight: 700, color: CLASSIFICATION_COLORS[doc.confidentiality], border: `1px solid ${CLASSIFICATION_COLORS[doc.confidentiality]}40` }}>
                    {CLASSIFICATION_LABELS[doc.confidentiality]}
                  </div>
                  {doc.href && (
                    <Link href={doc.href}>
                      <div style={{ padding: "3px 8px", fontSize: 8.5, fontWeight: 700, color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>Open →</div>
                    </Link>
                  )}
                </div>
              </div>

              <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6, marginBottom: 8 }}>{doc.description}</div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700, marginBottom: 3 }}>Audience</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>{doc.audience.join(" · ")}</div>
                </div>
                {doc.commercialStatus && (
                  <div style={{ padding: "3px 9px", fontSize: 8.5, color: "#f97316", border: "1px solid rgba(249,115,22,0.3)", alignSelf: "flex-end" }}>
                    ⚠ {doc.commercialStatus}
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3, alignSelf: "flex-end" }}>
                  {doc.tags.map(tag => (
                    <div key={tag} onClick={() => setTagFilter(tag)} style={{ padding: "2px 7px", fontSize: 8, color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>{tag}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER LINKS ── */}
        <div style={{ marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Pilot Model", href: "/partner-room/pilot-model" },
            { label: "Partner Ecosystem", href: "/partner-room/partner-ecosystem" },
            { label: "Next Step", href: "/partner-room/next-step" },
          ].map(b => <Link key={b.href} href={b.href}><div style={{ padding: "8px 16px", border: "1px solid rgba(255,255,255,0.1)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>)}
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
