import { createContext, useContext, useState, useCallback, ReactNode } from "react";

const STORAGE_KEY = "welbx_intervention_usage";

export interface UsageRecord {
  timesUsed: number;
  recentOutcomes: boolean[];
}

type UsageMap = Record<string, UsageRecord>;

function buildKey(momentId: string, interventionName: string): string {
  return `${momentId}|||${interventionName}`;
}

function loadFromStorage(): UsageMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as UsageMap;
  } catch {
    // ignore
  }
  return {};
}

function saveToStorage(map: UsageMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export interface InterventionUsageContextType {
  logUsage: (momentId: string, interventionName: string, succeeded: boolean) => void;
  getUsage: (momentId: string, interventionName: string) => UsageRecord;
}

const InterventionUsageContext = createContext<InterventionUsageContextType>({
  logUsage: () => {},
  getUsage: () => ({ timesUsed: 0, recentOutcomes: [] }),
});

export function InterventionUsageProvider({ children }: { children: ReactNode }) {
  const [usageMap, setUsageMap] = useState<UsageMap>(loadFromStorage);

  const logUsage = useCallback((momentId: string, interventionName: string, succeeded: boolean) => {
    const key = buildKey(momentId, interventionName);
    setUsageMap((prev) => {
      const existing = prev[key] ?? { timesUsed: 0, recentOutcomes: [] };
      const recentOutcomes = [...existing.recentOutcomes, succeeded].slice(-10);
      const next: UsageMap = {
        ...prev,
        [key]: {
          timesUsed: existing.timesUsed + 1,
          recentOutcomes,
        },
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  const getUsage = useCallback(
    (momentId: string, interventionName: string): UsageRecord => {
      const key = buildKey(momentId, interventionName);
      return usageMap[key] ?? { timesUsed: 0, recentOutcomes: [] };
    },
    [usageMap]
  );

  return (
    <InterventionUsageContext.Provider value={{ logUsage, getUsage }}>
      {children}
    </InterventionUsageContext.Provider>
  );
}

export const useInterventionUsage = () => useContext(InterventionUsageContext);
