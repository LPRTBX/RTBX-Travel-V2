/**
 * DeploymentContext — shared deployment state for RTBX Travel Sprint 4.
 *
 * Persists the active deployment configuration to localStorage.
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

const STORAGE_KEY = "rtbx_travel_deployment_v1";
const DEMO_LABEL  = "local synthetic demonstration data";

// ── Storage helpers ────────────────────────────────────────────────────────────

function loadFromStorage(): TravelDeploymentConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as TravelDeploymentConfig;
      // Safety check: must be synthetic
      if (parsed && parsed.synthetic === true) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function saveToStorage(config: TravelDeploymentConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore write errors
  }
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
   * "active-simulation", assigns a deployment ID, and persists to localStorage.
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
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const activateDeployment = useCallback((config: TravelDeploymentConfig) => {
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
    saveToStorage(activated);
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
