/**
 * PilotScopeContext — the pilot scope being drafted in this demonstration session.
 *
 * In memory only: the draft and any value assumptions brought from the Calculator
 * survive moving between Partner Room pages and end when the page is refreshed.
 * Nothing is saved or sent.
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { defaultPilotScope, type PilotScope, type ValueSnapshot } from "@/lib/pilotScope";

interface PilotScopeContextType {
  scope: PilotScope;
  setScope: (update: (current: PilotScope) => PilotScope) => void;
  value: ValueSnapshot | null;
  setValue: (value: ValueSnapshot | null) => void;
  resetScope: () => void;
}

const PilotScopeContext = createContext<PilotScopeContextType | null>(null);

export function PilotScopeProvider({ children }: { children: ReactNode }) {
  const [scope, setScopeState] = useState<PilotScope>(defaultPilotScope);
  const [value, setValue] = useState<ValueSnapshot | null>(null);
  const context = useMemo<PilotScopeContextType>(() => ({
    scope,
    setScope: update => setScopeState(current => update(current)),
    value,
    setValue,
    resetScope: () => { setScopeState(defaultPilotScope()); setValue(null); },
  }), [scope, value]);
  return <PilotScopeContext.Provider value={context}>{children}</PilotScopeContext.Provider>;
}

export function usePilotScope(): PilotScopeContextType {
  const ctx = useContext(PilotScopeContext);
  if (!ctx) throw new Error("usePilotScope must be used inside PilotScopeProvider");
  return ctx;
}
