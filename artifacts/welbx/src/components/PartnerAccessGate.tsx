import { useState, useEffect } from "react";
import { TravelWordmark } from "@/components/TravelWordmark";

const SESSION_KEY = "partner_room_access";
const REQUIRED_CODE = import.meta.env.VITE_PARTNER_ROOM_CODE as string | undefined;

interface PartnerAccessGateProps {
  children: React.ReactNode;
}

export function PartnerAccessGate({ children }: PartnerAccessGateProps) {
  const [granted, setGranted] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!REQUIRED_CODE) {
      setGranted(true);
    } else {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored === REQUIRED_CODE) {
        setGranted(true);
      }
    }
    setReady(true);
  }, []);

  if (!ready) return null;
  if (granted) return <>{children}</>;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() === REQUIRED_CODE) {
      sessionStorage.setItem(SESSION_KEY, REQUIRED_CODE!);
      setGranted(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#102d39",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    }}>
      <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>

        {/* Brand hierarchy */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}><TravelWordmark /></div>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
            JALDO · Travel Vertical
          </div>
          <div style={{ fontSize: 8.5, letterSpacing: "0.22em", color: "#a8dedb", textTransform: "uppercase", fontWeight: 700 }}>
            JALDO Travel · Partner Room
          </div>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14 }}>
          Controlled Partner Preview
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, marginBottom: 40 }}>
          This room is for invited partners reviewing JALDO Travel — the travel and hospitality operating vertical, powered by JALDO Core.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            placeholder="Access code"
            autoFocus
            style={{
              width: "100%",
              padding: "14px 18px",
              background: "rgba(255,255,255,0.04)",
              border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              fontSize: 14,
              outline: "none",
              letterSpacing: "0.08em",
              transition: "border-color 0.15s",
              boxSizing: "border-box",
            }}
            onFocus={e => { if (!error) (e.target as HTMLInputElement).style.borderColor = "rgba(168,222,219,0.5)"; }}
            onBlur={e => { if (!error) (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
          />
          {error && (
            <div style={{ fontSize: 11, color: "rgba(239,68,68,0.7)", letterSpacing: "0.04em", textAlign: "left" }}>
              Incorrect access code. Please try again.
            </div>
          )}
          <button
            type="submit"
            style={{
              padding: "13px 24px",
              background: "#a8dedb",
              color: "#102d39",
              border: "none",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#c4eeea"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#a8dedb"; }}
          >
            Enter Partner Room
          </button>
        </form>

        <p style={{ marginTop: 28, fontSize: 10, color: "rgba(255,255,255,0.22)", lineHeight: 1.6 }}>
          This access gate supports guided partner review and is not a production security boundary. Do not share the access code outside invited partners.
        </p>

        <div style={{ marginTop: 20, fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.12)", textTransform: "uppercase", fontWeight: 600 }}>
          JALDO Travel Partner Room v1.0
        </div>
      </div>
    </div>
  );
}
