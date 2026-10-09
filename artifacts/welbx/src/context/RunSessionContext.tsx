/**
 * RunSessionContext — runs of the activated deployment for this demonstration session.
 *
 * Held in memory only, so runs and their synthetic evidence survive moving between
 * Partner Room pages and end when the page is refreshed or closed. Nothing is saved
 * or sent anywhere.
 *
 * Every record carries the key of the configuration activation that produced it.
 * Activating a different configuration, re-activating the same one or resetting
 * discards the earlier records, and an update is accepted only when it carries the
 * exact key of the current activation, so a run can never be shown as a result of
 * a different activation.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { TravelDeploymentConfig } from "@/data/travelDeploymentConfig";
import type { ScenarioExecution } from "@/lib/runtimeEngine";
import { useDeployment } from "@/context/DeploymentContext";

export interface RunRecord {
  exec: ScenarioExecution;
  cycle: number;
  /** Draft approvals recorded in the run but not yet marked reviewed: communication id → approving role. */
  approvedComms: Record<string, string>;
  /** The configuration activation that produced this run. */
  configurationKey: string;
}

/** One activation of one configuration. Re-activating, even unchanged, starts a new key. */
export function configurationKey(deployment: TravelDeploymentConfig | null): string | null {
  return deployment ? `${deployment.id}@${deployment.activatedAt ?? deployment.updatedAt}` : null;
}

export interface RunSessionState { key: string | null; runs: Record<string, RunRecord> }

/** A change to one scenario's run, stamped with the activation the run belongs to. */
export interface RunUpdate {
  configurationKey: string | null;
  scenarioId: string;
  /** Null discards the scenario's run (e.g. after a reset of the trace). */
  exec: ScenarioExecution | null;
  cycle: number;
  approvedComms: Record<string, string>;
}

/** The session after a new activation: earlier records are discarded, never re-labelled. */
export function startActivation(state: RunSessionState, key: string | null): RunSessionState {
  return state.key === key ? state : { key, runs: {} };
}

/**
 * Apply one update. It is accepted only when it carries the exact key of the current
 * activation; an update from an earlier activation of the same deployment is rejected.
 */
export function applyRunUpdate(state: RunSessionState, update: RunUpdate): RunSessionState {
  if (!state.key || update.configurationKey !== state.key) return state;
  const { scenarioId, exec, cycle, approvedComms } = update;
  if (!exec) {
    if (!(scenarioId in state.runs)) return state;
    const { [scenarioId]: _removed, ...rest } = state.runs;
    return { ...state, runs: rest };
  }
  const existing = state.runs[scenarioId];
  if (existing && existing.exec === exec && existing.cycle === cycle && existing.approvedComms === approvedComms) return state;
  return { ...state, runs: { ...state.runs, [scenarioId]: { exec, cycle, approvedComms, configurationKey: state.key } } };
}

interface RunSessionContextType {
  /** The current activation's key; pass it back with every update. */
  activeKey: string | null;
  /** Records produced by the current activation, in the order the runs started. */
  records: RunRecord[];
  /** The stored run for one scenario of the current activation, if any. */
  recordFor: (scenarioId: string) => RunRecord | undefined;
  /** Store (or, with a null exec, discard) a scenario's run. Rejected unless the key matches the current activation. */
  recordRun: (update: RunUpdate) => void;
}

const RunSessionContext = createContext<RunSessionContextType | null>(null);

export function RunSessionProvider({ children }: { children: ReactNode }) {
  const { activeDeployment } = useDeployment();
  const activeKey = configurationKey(activeDeployment);
  const [session, setSession] = useState<RunSessionState>({ key: activeKey, runs: {} });

  // A different activation (or a reset) discards earlier records before anything renders them.
  let current = session;
  if (session.key !== activeKey) {
    current = startActivation(session, activeKey);
    setSession(current);
  }

  const recordRun = useCallback((update: RunUpdate) => setSession(prev => applyRunUpdate(prev, update)), []);

  const value = useMemo<RunSessionContextType>(() => {
    const valid = current.key === activeKey ? current.runs : {};
    const records = Object.values(valid).sort((a, b) => a.exec.startedAt.localeCompare(b.exec.startedAt));
    return { activeKey, records, recordFor: scenarioId => valid[scenarioId], recordRun };
  }, [current, activeKey, recordRun]);

  return <RunSessionContext.Provider value={value}>{children}</RunSessionContext.Provider>;
}

export function useRunSession(): RunSessionContextType {
  const ctx = useContext(RunSessionContext);
  if (!ctx) throw new Error("useRunSession must be used inside RunSessionProvider");
  return ctx;
}
