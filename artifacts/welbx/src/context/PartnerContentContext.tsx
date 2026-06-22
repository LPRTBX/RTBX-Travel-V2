import { createContext, useContext, useEffect, useState } from "react";
import { fetchPartnerContent, type PartnerContent } from "@/lib/partnerContent";

interface PartnerContentContextValue {
  content: PartnerContent | null;
  loading: boolean;
}

const PartnerContentContext = createContext<PartnerContentContextValue>({
  content: null,
  loading: true,
});

export function PartnerContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<PartnerContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartnerContent().then((data) => {
      setContent(data);
      setLoading(false);
    });
  }, []);

  return (
    <PartnerContentContext.Provider value={{ content, loading }}>
      {children}
    </PartnerContentContext.Provider>
  );
}

export function usePartnerContent() {
  return useContext(PartnerContentContext);
}
