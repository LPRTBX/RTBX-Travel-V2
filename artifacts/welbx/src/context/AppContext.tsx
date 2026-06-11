import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { type PropertyId, type RoleId, type PeriodId } from "@/data/entities";
import { SIGNAL_CATEGORIES } from "@/data/signals";
import { DECISIONS } from "@/data/decisions";
import { PLAYBOOKS } from "@/data/playbooks";
import {
  computeSignalHealthScore,
  computeDecisionHealthScore,
  computeExecutionHealthScore,
  computeLiveHealthStats,
  type LiveHealthStats,
} from "@/lib/envHealthScores";

export interface HealthScores {
  signal: number;
  decision: number;
  execution: number;
}

export interface AppContextType {
  vipResolved: boolean;
  resolveVIP: () => void;
  flowStep: number;
  vectorExecuting: boolean;
  momentCount: number;
  activeProperty: PropertyId;
  setActiveProperty: (p: PropertyId) => void;
  activeRole: RoleId;
  setActiveRole: (r: RoleId) => void;
  activePeriod: PeriodId;
  setActivePeriod: (p: PeriodId) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  /** Live scores derived from Signal/Decision/Playbook data. Re-derived whenever
   *  refreshHealthScores() is called (e.g. after a data update on those pages). */
  healthScores: HealthScores;
  liveHealthStats: LiveHealthStats;
  /** Call this from SignalRegistry, DecisionRegistry, or PlaybookEngine after any
   *  data mutation to cause EnvironmentHealthIndex to recompute its live scores. */
  refreshHealthScores: () => void;
}

function deriveSignals() {
  return SIGNAL_CATEGORIES.flatMap(c => c.signals);
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [vipResolved, setVipResolved] = useState(false);
  const [flowStep, setFlowStep] = useState(0);
  const [vectorExecuting, setVectorExecuting] = useState(false);
  const [momentCount, setMomentCount] = useState(47);
  const [activeProperty, setActiveProperty] = useState<PropertyId>("gml");
  const [activeRole, setActiveRole] = useState<RoleId>("gm");
  const [activePeriod, setActivePeriod] = useState<PeriodId>("30d");
  const [searchOpen, setSearchOpen] = useState(false);

  // dataVersion is the single mutable trigger for health score recomputation.
  // incrementing it via refreshHealthScores() causes useMemo to re-derive all scores.
  const [dataVersion, setDataVersion] = useState(0);

  const healthScores = useMemo((): HealthScores => {
    const signals = deriveSignals();
    return {
      signal:    computeSignalHealthScore(signals),
      decision:  computeDecisionHealthScore(DECISIONS),
      execution: computeExecutionHealthScore(PLAYBOOKS),
    };
  }, [dataVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  const liveHealthStats = useMemo(
    () => computeLiveHealthStats(deriveSignals(), DECISIONS, PLAYBOOKS),
    [dataVersion], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const refreshHealthScores = useCallback(() => {
    setDataVersion(v => v + 1);
  }, []);

  const resolveVIP = () => {
    if (vipResolved) return;
    setVipResolved(true);
    setVectorExecuting(true);
    const delays: [number, () => void][] = [
      [1100, () => { setVectorExecuting(false); setFlowStep(1); }],
      [1900, () => setFlowStep(2)],
      [2700, () => setFlowStep(3)],
      [3500, () => { setFlowStep(4); setMomentCount(48); }],
    ];
    delays.forEach(([ms, fn]) => setTimeout(fn, ms));
  };

  return (
    <AppContext.Provider value={{
      vipResolved, resolveVIP, flowStep, vectorExecuting, momentCount,
      activeProperty, setActiveProperty,
      activeRole, setActiveRole,
      activePeriod, setActivePeriod,
      searchOpen, setSearchOpen,
      healthScores, liveHealthStats, refreshHealthScores,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
