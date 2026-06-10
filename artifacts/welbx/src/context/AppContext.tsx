import { createContext, useContext, useState, ReactNode } from "react";
import { type PropertyId, type RoleId, type PeriodId } from "@/data/entities";

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
}

const AppContext = createContext<AppContextType>({
  vipResolved: false,
  resolveVIP: () => {},
  flowStep: 0,
  vectorExecuting: false,
  momentCount: 47,
  activeProperty: "gml",
  setActiveProperty: () => {},
  activeRole: "gm",
  setActiveRole: () => {},
  activePeriod: "30d",
  setActivePeriod: () => {},
  searchOpen: false,
  setSearchOpen: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [vipResolved, setVipResolved] = useState(false);
  const [flowStep, setFlowStep] = useState(0);
  const [vectorExecuting, setVectorExecuting] = useState(false);
  const [momentCount, setMomentCount] = useState(47);
  const [activeProperty, setActiveProperty] = useState<PropertyId>("gml");
  const [activeRole, setActiveRole] = useState<RoleId>("gm");
  const [activePeriod, setActivePeriod] = useState<PeriodId>("30d");
  const [searchOpen, setSearchOpen] = useState(false);

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
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
