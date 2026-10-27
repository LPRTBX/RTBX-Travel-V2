/**
 * DeploymentContext — shared deployment state for JALDO Travel Sprint 4.
 *
 * Keeps the active deployment configuration in authenticated-page memory only.
 * All data is local synthetic demonstration data — not a production
 * customer environment or a live integration.
 *
 * Pattern follows InterventionUsageContext.tsx.
 */

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  type TravelDeploymentConfig,
  type DeploymentStatus,
} from "@/data/travelDeploymentConfig";
import { getDeploymentActivationReadiness } from "@/lib/travelScenarioRouting";

const STORAGE_KEY = "rtbx_travel_deployment_v1";
const DEMO_LABEL  = "local synthetic demonstration data";

// ── Storage helpers ────────────────────────────────────────────────────────────

function loadFromStorage(): TravelDeploymentConfig | null {
  try {
    // Remove earlier browser-persisted configuration; never restore it.
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore parse errors
  }
  return null;
}

function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function generateDeploymentId(): string {
  return `dep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Context interface ──────────────────────────────────────────────────────────

export interface DeploymentContextType {
  /** The currently active deployment, or null if none has been activated. */
  activeDeployment: TravelDeploymentConfig | null;

  /**
   * Partially update the active deployment in-place.
   * Call this to update fields without a full re-activate cycle.
   */
  updateDeployment: (updates: Partial<TravelDeploymentConfig>) => void;

  /**
   * Activate a deployment configuration. Sets deploymentStatus to
   * "active-simulation" and assigns a deployment ID. Ends on refresh or logout.
   * Label: local synthetic demonstration data.
   */
  activateDeployment: (config: TravelDeploymentConfig) => void;

  /**
   * Reset the active deployment back to null and clear localStorage.
   * Use this to start a new configuration cycle.
   */
  resetDeployment: () => void;

  /**
   * Export the current deployment configuration as a JSON string
   * (for copy-paste or sharing within the demo context).
   */
  exportDeployment: () => string;

  /** The demo label string — always "local synthetic demonstration data". */
  demoLabel: string;
}

// ── Context creation ───────────────────────────────────────────────────────────

const DeploymentContext = createContext<DeploymentContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function DeploymentProvider({ children }: { children: ReactNode }) {
  const [activeDeployment, setActiveDeployment] = useState<TravelDeploymentConfig | null>(
    loadFromStorage
  );

  const updateDeployment = useCallback((updates: Partial<TravelDeploymentConfig>) => {
    setActiveDeployment(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
        synthetic: true as const,
      };
      return updated;
    });
  }, []);

  const activateDeployment = useCallback((config: TravelDeploymentConfig) => {
    const activationReadiness = getDeploymentActivationReadiness(config);
    if (!activationReadiness.ready) {
      throw new Error(
        activationReadiness.issues.map(issue => issue.reason).join(" "),
      );
    }
    const now = new Date().toISOString();
    const activated: TravelDeploymentConfig = {
      ...config,
      id: config.id.startsWith("dep-harbour") ? config.id : generateDeploymentId(),
      deploymentStatus: "active-simulation" as DeploymentStatus,
      activatedAt: now,
      updatedAt: now,
      synthetic: true,
    };
    setActiveDeployment(activated);
  }, []);

  const resetDeployment = useCallback(() => {
    setActiveDeployment(null);
    clearStorage();
  }, []);

  const exportDeployment = useCallback((): string => {
    if (!activeDeployment) return "{}";
    return JSON.stringify({ ...activeDeployment, _label: DEMO_LABEL }, null, 2);
  }, [activeDeployment]);

  return (
    <DeploymentContext.Provider value={{
      activeDeployment,
      updateDeployment,
      activateDeployment,
      resetDeployment,
      exportDeployment,
      demoLabel: DEMO_LABEL,
    }}>
      {children}
    </DeploymentContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDeployment(): DeploymentContextType {
  const ctx = useContext(DeploymentContext);
  if (!ctx) throw new Error("useDeployment must be used inside DeploymentProvider");
  return ctx;
}
