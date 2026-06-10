import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { INTERVENTION_LIBRARY, type Category, type FreqLabel, type Intervention, type LibraryMoment } from "@/data/interventions";
import { useInterventionUsage } from "@/context/InterventionUsageContext";

const C = {
  amber:  "#c9a84c",
  blue:   "#3b82f6",
  green:  "#10b981",
  red:    "#ef4444",
  violet: "#a78bfa",
  slate:  "hsl(215 16% 44%)",
  border: "hsl(220 13% 9%)",
  card:   "hsl(220 13% 7%)",
  bg:     "hsl(220 13% 5%)",
  muted:  "hsl(215 16% 36%)",
  dimmed: "hsl(215 16% 22%)",
  dim2:   "hsl(215 16% 32%)",
};

const CAT_COLOR: Record<Category, string> = {
  Guest:       C.amber,
  Workforce:   C.blue,
  Operational: C.slate,
  Commercial:  C.green,
  Strategic:   C.violet,
};

const FREQ_COLOR: Record<FreqLabel, string> = {
  Low:    C.slate,
  Medium: C.amber,
  High:   C.green,
};

const ALL_CATEGORIES: Category[] = ["Guest", "Workforce", "Operational", "Commercial", "Strategic"];

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            style={{
              background: `${C.amber}33`,
              color: C.amber,
              borderRadius: 2,
              padding: "0 1px",
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function OutcomeTag({ label, query }: { label: string; query?: string }) {
  return (
    <span style={{
      fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
      color: C.amber, border: `1px solid ${C.amber}33`, padding: "2px 8px",
      background: `${C.amber}0d`, flexShrink: 0,
    }}>
      {query ? <Highlight text={label} query={query} /> : label}
    </span>
  );
}

function MetricPill({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "8px 14px",
      background: "hsl(220 13% 6%)",
      border: `1px solid hsl(220 13% 11%)`,
      minWidth: 80,
    }}>
      <div style={{ fontSize: 14, fontWeight: 800, color, letterSpacing: "-0.01em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginTop: 5, textAlign: "center" }}>
        {label}
      </div>
    </div>
  );
}

function UsageCell({ timesUsed, sessionUses }: { timesUsed: number; sessionUses: number }) {
  const freqColor = timesUsed > 0 ? C.green : C.dimmed;
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "8px 14px",
      background: "hsl(220 13% 6%)",
      border: `1px solid hsl(220 13% 11%)`,
      minWidth: 80,
    }}>
      {timesUsed === 0 ? (
        <div style={{ fontSize: 12, fontWeight: 700, color: C.dimmed, lineHeight: 1 }}>—</div>
      ) : (
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: freqColor, letterSpacing: "-0.01em", lineHeight: 1 }}>
            {timesUsed}
          </div>
          {sessionUses > 0 && (
            <div style={{ fontSize: 8, fontWeight: 700, color: C.green, letterSpacing: "0.06em" }}>
              +{sessionUses}
            </div>
          )}
        </div>
      )}
      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginTop: 5, textAlign: "center" }}>
        Times Used
      </div>
    </div>
  );
}

function OutcomeTrendCell({ recentOutcomes }: { recentOutcomes: boolean[] }) {
  if (recentOutcomes.length < 2) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "8px 10px",
        background: "hsl(220 13% 6%)",
        border: `1px solid hsl(220 13% 11%)`,
        minWidth: 90,
        gap: 4,
      }}>
        <div style={{ fontSize: 10, color: C.dimmed, letterSpacing: "0.04em" }}>—</div>
        <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", textAlign: "center" }}>
          Outcome Trend
        </div>
      </div>
    );
  }

  const data = recentOutcomes.map((v, i) => ({ x: i, v: v ? 100 : 0 }));
  const successCount = recentOutcomes.filter(Boolean).length;
  const liveRate = Math.round((successCount / recentOutcomes.length) * 100);
  const first = data[0].v;
  const last = data[data.length - 1].v;
  const delta = last - first;
  const trendColor = liveRate >= 75 ? C.green : liveRate >= 50 ? C.amber : C.red;

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      padding: "8px 10px",
      background: "hsl(220 13% 6%)",
      border: `1px solid hsl(220 13% 11%)`,
      minWidth: 90,
      gap: 3,
    }}>
      <div style={{ width: "100%", height: 28 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={trendColor}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div style={{
                    background: "hsl(220 13% 8%)",
                    border: "1px solid hsl(220 13% 12%)",
                    padding: "3px 6px",
                    fontSize: 9, color: "#fff", fontWeight: 700,
                  }}>
                    {payload[0].value === 100 ? "Resolved" : "Not resolved"}
                  </div>
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase" }}>
          Outcome Trend
        </div>
        <div style={{ fontSize: 7, fontWeight: 700, color: trendColor, letterSpacing: "0.08em" }}>
          {delta > 0 ? "▲" : delta < 0 ? "▼" : "—"} {liveRate}%
        </div>
      </div>
    </div>
  );
}

function InterventionRow({
  intervention,
  momentId,
  index,
  searchQuery,
}: {
  intervention: Intervention;
  momentId: string;
  index: number;
  searchQuery?: string;
}) {
  const { getUsage } = useInterventionUsage();
  const usage = getUsage(momentId, intervention.name);

  const freqColor = FREQ_COLOR[intervention.usageFrequency];
  const qualColor = intervention.outcomeQuality >= 8.5 ? C.green
    : intervention.outcomeQuality >= 7.0 ? C.amber
    : C.slate;

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "12px 20px",
        borderBottom: "1px solid hsl(220 13% 8%)",
        background: index % 2 === 0 ? "hsl(220 13% 5%)" : "hsl(220 13% 6%)",
      }}
    >
      <div style={{
        fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed,
        minWidth: 18, flexShrink: 0,
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>
        {searchQuery ? <Highlight text={intervention.name} query={searchQuery} /> : intervention.name}
        {usage.timesUsed > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4, marginLeft: 10,
            fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            color: C.green, background: `${C.green}12`, border: `1px solid ${C.green}33`,
            padding: "2px 7px",
          }}>
            <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
              <path d="M1 3.5L2.8 5.5L6 1.5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="square"/>
            </svg>
            Used {usage.timesUsed}x this session
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0, alignItems: "flex-start" }}>
        <MetricPill
          label="Success Rate"
          value={`${intervention.successRate}%`}
          color={intervention.successRate >= 85 ? C.green : intervention.successRate >= 72 ? C.amber : C.slate}
        />
        <UsageCell timesUsed={usage.timesUsed} sessionUses={usage.timesUsed} />
        <MetricPill label="Usage Freq" value={intervention.usageFrequency} color={freqColor} />
        <MetricPill label="Outcome Quality" value={intervention.outcomeQuality.toFixed(1)} color={qualColor} />
        <OutcomeTrendCell recentOutcomes={usage.recentOutcomes} />
      </div>
    </motion.div>
  );
}

function MomentAccordion({
  moment,
  catColor,
  globalIndex,
  searchQuery,
  filteredInterventions,
  forceOpen,
}: {
  moment: LibraryMoment;
  catColor: string;
  globalIndex: number;
  searchQuery?: string;
  filteredInterventions?: Intervention[];
  forceOpen?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { getUsage } = useInterventionUsage();
  const displayInterventions = filteredInterventions ?? moment.interventions;
  const totalUses = displayInterventions.reduce((sum, iv) => sum + getUsage(moment.id, iv.name).timesUsed, 0);
  const isOpen = forceOpen !== undefined ? forceOpen : open;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: globalIndex * 0.05, duration: 0.3 }}
      style={{
        border: `1px solid hsl(220 13% 9%)`,
        borderLeft: `2px solid ${catColor}`,
        marginBottom: 2,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px 14px 18px",
          background: isOpen ? "hsl(220 13% 8%)" : "hsl(220 13% 7%)",
          border: "none", cursor: "pointer",
          transition: "background 0.15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, minWidth: 44, textTransform: "uppercase", fontFamily: "var(--app-font-mono)" }}>
            {moment.id}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
            {searchQuery ? <Highlight text={moment.name} query={searchQuery} /> : moment.name}
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {moment.expectedOutcomes.map((o) => (
              <OutcomeTag key={o} label={o} query={searchQuery} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          {totalUses > 0 && (
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.green, textTransform: "uppercase" }}>
              {totalUses} use{totalUses !== 1 ? "s" : ""} logged
            </span>
          )}
          <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", color: C.dim2, textTransform: "uppercase" }}>
            {displayInterventions.length} interventions
          </span>
          <div style={{
            width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid hsl(220 13% 12%)`,
            background: "hsl(220 13% 9%)",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1 2.5L4 5.5L7 2.5" stroke={C.amber} strokeWidth="1.5" strokeLinecap="square"/>
            </svg>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ borderTop: `1px solid hsl(220 13% 9%)` }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "7px 20px 7px 18px",
                background: "hsl(220 13% 6%)",
                borderBottom: "1px solid hsl(220 13% 9%)",
              }}>
                <div style={{ minWidth: 18 }} />
                <div style={{ flex: 1, fontSize: 7, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>
                  Intervention Option
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {["Success Rate", "Times Used", "Usage Frequency", "Outcome Quality", "Outcome Trend"].map((h) => (
                    <div key={h} style={{ minWidth: h === "Outcome Trend" ? 90 : 80, fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", textAlign: "center" }}>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
              {displayInterventions.map((iv, i) => (
                <InterventionRow key={iv.name} intervention={iv} momentId={moment.id} index={i} searchQuery={searchQuery} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TotalUsesAcrossLibrary() {
  const { getUsage } = useInterventionUsage();
  const total = INTERVENTION_LIBRARY.flatMap((d) =>
    d.moments.flatMap((m) =>
      m.interventions.map((iv) => getUsage(m.id, iv.name).timesUsed)
    )
  ).reduce((a, b) => a + b, 0);
  return <>{total}</>;
}

export default function InterventionLibrary() {
  const [activeCategory, setActiveCategory] = useState<Category>("Guest");
  const [searchQuery, setSearchQuery] = useState("");

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return null;
    const results: Array<{
      category: Category;
      catColor: string;
      moment: LibraryMoment;
      filteredInterventions: Intervention[];
    }> = [];
    for (const d of INTERVENTION_LIBRARY) {
      for (const moment of d.moments) {
        const momentNameMatch = moment.name.toLowerCase().includes(trimmedQuery);
        const outcomeMatch = moment.expectedOutcomes.some((o) => o.toLowerCase().includes(trimmedQuery));
        const matchingInterventions = moment.interventions.filter((iv) =>
          iv.name.toLowerCase().includes(trimmedQuery)
        );
        if (momentNameMatch || outcomeMatch) {
          results.push({
            category: d.category,
            catColor: CAT_COLOR[d.category],
            moment,
            filteredInterventions: moment.interventions,
          });
        } else if (matchingInterventions.length > 0) {
          results.push({
            category: d.category,
            catColor: CAT_COLOR[d.category],
            moment,
            filteredInterventions: matchingInterventions,
          });
        }
      }
    }
    return results;
  }, [trimmedQuery, isSearching]);

  const catData = INTERVENTION_LIBRARY.find((d) => d.category === activeCategory)!;
  const catColor = CAT_COLOR[activeCategory];

  let globalIndex = 0;

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}
        >
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
              WELBX · Operating Layer
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
              Intervention Library
            </h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>
              Behavioural response catalogue — what to do, how to do it, and why it works
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
              {INTERVENTION_LIBRARY.reduce((a, d) => a + d.moments.reduce((b, m) => b + m.interventions.length, 0), 0)} interventions
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 18%)", textTransform: "uppercase", marginBottom: 4 }}>
              {INTERVENTION_LIBRARY.reduce((a, d) => a + d.moments.length, 0)} moments · 5 domains
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase" }}>
              <TotalUsesAcrossLibrary /> uses logged this session
            </div>
          </div>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.35 }}
          style={{ marginBottom: 24 }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "hsl(220 13% 7%)",
            border: `1px solid ${isSearching ? C.amber + "55" : "hsl(220 13% 11%)"}`,
            padding: "10px 16px",
            transition: "border-color 0.2s",
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="5.5" cy="5.5" r="4" stroke={isSearching ? C.amber : C.dimmed} strokeWidth="1.5" />
              <path d="M9 9L12 12" stroke={isSearching ? C.amber : C.dimmed} strokeWidth="1.5" strokeLinecap="square" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search moments, interventions, or expected outcomes across all domains…"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 11.5,
                fontWeight: 500,
                color: "#fff",
                letterSpacing: "0.02em",
              }}
            />
            {isSearching && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "hsl(220 13% 10%)",
                  border: "1px solid hsl(220 13% 14%)",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 20, height: 20, flexShrink: 0,
                  color: C.dimmed,
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                ×
              </button>
            )}
            {isSearching && searchResults !== null && (
              <div style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                color: searchResults.length > 0 ? C.amber : C.dimmed,
                flexShrink: 0,
              }}>
                {searchResults.length} moment{searchResults.length !== 1 ? "s" : ""} matched
              </div>
            )}
          </div>
        </motion.div>

        {/* Summary strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.38 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, marginBottom: 28 }}
        >
          {INTERVENTION_LIBRARY.map((d) => {
            const cc = CAT_COLOR[d.category];
            const allIvs = d.moments.flatMap((m) => m.interventions);
            const avgSuccess = Math.round(allIvs.reduce((a, iv) => a + iv.successRate, 0) / allIvs.length);
            const matchCount = isSearching && searchResults
              ? searchResults.filter((r) => r.category === d.category).length
              : null;
            return (
              <div
                key={d.category}
                onClick={() => { setActiveCategory(d.category); setSearchQuery(""); }}
                style={{
                  padding: "16px 20px",
                  background: !isSearching && activeCategory === d.category ? "hsl(220 13% 9%)" : C.card,
                  borderTop: `2px solid ${cc}`,
                  border: `1px solid ${!isSearching && activeCategory === d.category ? cc + "44" : C.border}`,
                  borderTopColor: cc,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  opacity: isSearching && matchCount === 0 ? 0.4 : 1,
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 5 }}>
                  {isSearching && matchCount !== null ? matchCount : avgSuccess + "%"}
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: "hsl(215 16% 48%)", marginBottom: 3 }}>
                  {d.category}
                </div>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: cc, textTransform: "uppercase" }}>
                  {isSearching ? `match${matchCount !== 1 ? "es" : ""} · ${d.moments.length} moments` : `Avg success · ${d.moments.length} moments`}
                </div>
              </div>
            );
          })}
        </motion.div>

        {isSearching ? (
          /* Search results view — all categories */
          <AnimatePresence mode="wait">
            <motion.div
              key={`search-${trimmedQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {searchResults && searchResults.length > 0 ? (
                <>
                  {searchResults.map((result, idx) => (
                    <div key={`${result.category}-${result.moment.id}`} style={{ marginBottom: 2 }}>
                      {(idx === 0 || searchResults[idx - 1].category !== result.category) && (
                        <div style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "6px 12px 6px 14px",
                          background: "hsl(220 13% 8%)",
                          borderLeft: `2px solid ${result.catColor}`,
                          borderBottom: "1px solid hsl(220 13% 9%)",
                          marginBottom: 2,
                        }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: result.catColor, flexShrink: 0 }} />
                          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: result.catColor, textTransform: "uppercase" }}>
                            {result.category} Domain
                          </div>
                          <div style={{ fontSize: 7.5, color: C.dimmed, letterSpacing: "0.08em" }}>
                            · {searchResults.filter((r) => r.category === result.category).length} moment{searchResults.filter((r) => r.category === result.category).length !== 1 ? "s" : ""} matched
                          </div>
                        </div>
                      )}
                      <MomentAccordion
                        moment={result.moment}
                        catColor={result.catColor}
                        globalIndex={idx}
                        searchQuery={trimmedQuery}
                        filteredInterventions={result.filteredInterventions}
                        forceOpen
                      />
                    </div>
                  ))}
                </>
              ) : (
                <div style={{
                  padding: "48px 24px",
                  border: `1px solid hsl(220 13% 9%)`,
                  background: "hsl(220 13% 7%)",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dimmed, marginBottom: 8 }}>
                    No matches found
                  </div>
                  <div style={{ fontSize: 10, color: "hsl(215 16% 18%)", letterSpacing: "0.06em" }}>
                    Try a different keyword — search covers moment names, intervention options, and expected outcomes
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <>
            {/* Category tabs */}
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.35 }}
              style={{ display: "flex", gap: 1, marginBottom: 0 }}
            >
              {ALL_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                const color = CAT_COLOR[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: "10px 20px",
                      background: isActive ? "hsl(220 13% 9%)" : "transparent",
                      border: `1px solid ${isActive ? color + "44" : "hsl(220 13% 10%)"}`,
                      borderBottom: isActive ? `1px solid hsl(220 13% 9%)` : `1px solid hsl(220 13% 10%)`,
                      borderTop: isActive ? `2px solid ${color}` : "2px solid transparent",
                      cursor: "pointer", transition: "all 0.15s",
                      display: "flex", alignItems: "center", gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: isActive ? "#fff" : "hsl(215 16% 36%)" }}>
                      {cat}
                    </span>
                    <span style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                      color: isActive ? color : C.dimmed,
                      border: `1px solid ${isActive ? color + "33" : "transparent"}`,
                      padding: "1px 5px",
                      background: isActive ? `${color}0d` : "transparent",
                    }}>
                      {INTERVENTION_LIBRARY.find((d) => d.category === cat)!.moments.length}
                    </span>
                  </button>
                );
              })}
            </motion.div>

            {/* Accordion list */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  border: `1px solid hsl(220 13% 9%)`,
                  borderTop: `2px solid ${catColor}`,
                  background: "hsl(220 13% 7%)",
                  padding: "16px 16px",
                }}
              >
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
                  paddingBottom: 12, borderBottom: `1px solid hsl(220 13% 9%)`,
                }}>
                  <div style={{ width: 3, height: 18, background: catColor, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: catColor, textTransform: "uppercase" }}>
                      {activeCategory} Domain
                    </div>
                    <div style={{ fontSize: 8.5, color: C.dim2, marginTop: 2 }}>
                      {catData.moments.length} moment categories · Expand to view interventions with live usage data
                    </div>
                  </div>
                </div>

                {catData.moments.map((moment) => {
                  const idx = globalIndex++;
                  return (
                    <MomentAccordion
                      key={moment.id}
                      moment={moment}
                      catColor={catColor}
                      globalIndex={idx}
                    />
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            marginTop: 20, padding: "14px 20px",
            border: `1px solid ${C.border}`,
            background: C.card,
            display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap",
          }}
        >
          {[
            { color: C.green, label: "Success Rate ≥ 85% · High confidence" },
            { color: C.amber, label: "Success Rate 72–84% · Strong confidence" },
            { color: C.slate, label: "Success Rate < 72% · Situational" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 20, height: 3, background: color }} />
              <span style={{ fontSize: 8.5, color: C.dimmed }}>{label}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>
            Usage &amp; trend data sourced from live operator closures in Command Centre · no synthetic data
          </div>
        </motion.div>

        {/* Engine footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.4 }}
          style={{
            marginTop: 16, paddingTop: 16,
            borderTop: `1px solid ${C.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { name: "BXOS", desc: "Moment classification · Intervention scoring · Outcome attribution" },
              { name: "NEXUS", desc: "Response routing · Escalation governance · Owner assignment" },
              { name: "VECTOR", desc: "Execution tracking · Success measurement · Library learning" },
            ].map(e => (
              <div key={e.name} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>{e.name}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 16%)", letterSpacing: "0.04em" }}>· {e.desc}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 7.5, color: "hsl(215 16% 12%)", letterSpacing: "0.08em" }}>
            WELBX Operating Layer · Build 4.1.0 · Intervention Library Engine v2
          </div>
        </motion.div>

      </div>
    </div>
  );
}
