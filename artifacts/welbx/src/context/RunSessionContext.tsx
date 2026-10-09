/**
 * RunSessionContext — runs of the activated deployment for this demonstration session.
 *
 * Held in memory only, so runs and their synthetic evidence survive moving between
 * Partner Room pages and end when the page is refreshed or closed. Nothing is saved
 * or sent anywhere.
 *
 * Every record carries the key of the configuration that produced it. Activating a
 * different configuration, re-activating the same one or resetting it discards the
 * earlier records, so they can never be shown as results of the new configuration.
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { TravelDeploymentConfig } from "@/data/travelDeploymentConfig";
import type { ScenarioExecution } from "@/lib/runtimeEngine";
import { useDeployment } from "@/context/DeploymentContext";

export interface RunRecord {
  exec: ScenarioExecution;
  cycle: number;
  /** The configuration activation that produced this run. */
  configurationKey: string;
}

/** One activation of one configuration. Re-activating, even unchanged, starts a new key. */
export function configurationKey(deployment: TravelDeploymentConfig | null): string | null {
  return deployment ? `${deployment.id}@${deployment.activatedAt ?? deployment.updatedAt}` : null;
}

interface RunSessionContextType {
  /** Records produced by the active configuration, in the order the runs started. */
  records: RunRecord[];
  /** The stored run for one scenario of the active configuration, if any. */
  recordFor: (scenarioId: string) => RunRecord | undefined;
  /** Store (or, with null, discard) a scenario's run for the active configuration. */
  recordRun: (scenarioId: string, exec: ScenarioExecution | null, cycle: number) => void;
}

const RunSessionContext = createContext<RunSessionContextType | null>(null);

interface SessionState { key: string | null; runs: Record<string, RunRecord> }

export function RunSessionProvider({ children }: { children: ReactNode }) {
  const { activeDeployment } = useDeployment();
  const activeKey = configurationKey(activeDeployment);
  const [session, setSession] = useState<SessionState>({ key: activeKey, runs: {} });

  // A different activation (or a reset) discards earlier records before anything renders them.
  let current = session;
  if (session.key !== activeKey) {
    current = { key: activeKey, runs: {} };
    setSession(current);
  }
  const keyRef = useRef(activeKey);
  keyRef.current = activeKey;

  const recordRun = useCallback((scenarioId: string, exec: ScenarioExecution | null, cycle: number) => {
    const key = keyRef.current;
    setSession(prev => {
      // A run reported for another configuration (e.g. by a page still unmounting) is never stored.
      if (!key || prev.key !== key || (exec && exec.deploymentId !== key.split("@")[0])) return prev;
      if (!exec) {
        if (!(scenarioId in prev.runs)) return prev;
        const { [scenarioId]: _removed, ...rest } = prev.runs;
        return { ...prev, runs: rest };
      }
      const existing = prev.runs[scenarioId];
      if (existing && existing.exec === exec && existing.cycle === cycle) return prev;
      return { ...prev, runs: { ...prev.runs, [scenarioId]: { exec, cycle, configurationKey: key } } };
    });
  }, []);

  const value = useMemo<RunSessionContextType>(() => {
    const valid = current.key === activeKey ? current.runs : {};
    const records = Object.values(valid).sort((a, b) => a.exec.startedAt.localeCompare(b.exec.startedAt));
    return { records, recordFor: scenarioId => valid[scenarioId], recordRun };
  }, [current, activeKey, recordRun]);

  return <RunSessionContext.Provider value={value}>{children}</RunSessionContext.Provider>;
}

export function useRunSession(): RunSessionContextType {
  const ctx = useContext(RunSessionContext);
  if (!ctx) throw new Error("useRunSession must be used inside RunSessionProvider");
  return ctx;
}
