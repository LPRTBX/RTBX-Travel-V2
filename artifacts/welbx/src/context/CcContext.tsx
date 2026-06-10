import { createContext, useContext, useState, ReactNode } from "react";
import { INITIAL_CC_ROWS } from "@/data/cc-rows";
import type { CcRow, CcStatus } from "@/data/cc-rows";

interface CcContextType {
  ccRows: CcRow[];
  updateRowStatus: (id: string, status: CcStatus, outcome?: string) => void;
}

const CcContext = createContext<CcContextType>({
  ccRows: INITIAL_CC_ROWS,
  updateRowStatus: () => {},
});

export function CcProvider({ children }: { children: ReactNode }) {
  const [ccRows, setCcRows] = useState<CcRow[]>(INITIAL_CC_ROWS);

  const updateRowStatus = (id: string, status: CcStatus, outcome?: string) => {
    setCcRows(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status, ...(outcome !== undefined ? { outcome } : {}) }
          : r
      )
    );
  };

  return (
    <CcContext.Provider value={{ ccRows, updateRowStatus }}>
      {children}
    </CcContext.Provider>
  );
}

export const useCc = () => useContext(CcContext);
