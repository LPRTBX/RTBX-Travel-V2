import { createContext, useContext, useState, ReactNode } from "react";

export interface AppContextType {
  vipResolved: boolean;
  resolveVIP: () => void;
  flowStep: number;
  vectorExecuting: boolean;
  momentCount: number;
}

const AppContext = createContext<AppContextType>({
  vipResolved: false,
  resolveVIP: () => {},
  flowStep: 0,
  vectorExecuting: false,
  momentCount: 47,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [vipResolved, setVipResolved] = useState(false);
  const [flowStep, setFlowStep] = useState(0);
  const [vectorExecuting, setVectorExecuting] = useState(false);
  const [momentCount, setMomentCount] = useState(47);

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
    <AppContext.Provider value={{ vipResolved, resolveVIP, flowStep, vectorExecuting, momentCount }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
