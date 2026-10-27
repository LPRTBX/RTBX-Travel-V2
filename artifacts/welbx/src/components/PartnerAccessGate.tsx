import { useEffect, useState, type ReactNode } from "react";

/** Session UI only. The Node server protects HTML, assets and data first. */
export function PartnerAccessGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ expiresAt: number; csrf: string }>();
  const [error, setError] = useState(false);
  useEffect(() => {
    let live = true;
    let timer: ReturnType<typeof setTimeout>;
    const hide = () => { const root = document.getElementById("root"); if (root) root.style.visibility = "hidden"; };
    const entry = () => { hide(); window.location.replace(`/partner-access?reason=expired&returnTo=${encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}`); };
    const check = async () => {
      try {
        const response = await fetch("/partner-session", { cache: "no-store", credentials: "same-origin" });
        if (response.status === 401) return entry();
        if (!response.ok) throw new Error("Session unavailable");
        const current = await response.json();
        if (!Number.isFinite(current.expiresAt) || typeof current.csrf !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(current.csrf)) throw new Error("Invalid session response");
        if (!live) return;
        if (current.expiresAt <= Date.now()) return entry();
        setSession(current);
        setError(false);
        clearTimeout(timer);
        timer = setTimeout(entry, current.expiresAt - Date.now());
      } catch {
        if (live) { setSession(undefined); setError(true); }
      }
    };
    void check();
    const interval = setInterval(check, 30_000);
    const focus = () => void check();
    const restored = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload(); };
    window.addEventListener("focus", focus);
    window.addEventListener("pageshow", restored);
    window.addEventListener("pagehide", hide);
    return () => { live = false; clearTimeout(timer); clearInterval(interval); window.removeEventListener("focus", focus); window.removeEventListener("pageshow", restored); window.removeEventListener("pagehide", hide); };
  }, []);
  if (!session) return <main style={{ padding: 32, color: "#fff", background: "#102d39", minHeight: "100vh" }}>
    <h1>Controlled Partner Preview</h1>
    <p>{error ? "Your session could not be verified. Reload to retry, or leave the room." : "Checking partner session…"}</p>
    {error && <button onClick={() => window.location.reload()}>Retry</button>} <a href="/">Public introduction</a>
  </main>;
  return <>
    <div style={{ background: "#173b48", color: "#fff", padding: "10px 20px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", fontSize: 13 }}>
      <span>Partner Room · session ends {new Date(session.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      <form method="post" action="/partner-logout" style={{ marginLeft: "auto" }} onSubmit={() => { localStorage.clear(); sessionStorage.clear(); }}>
        <input type="hidden" name="csrf" value={session.csrf} />
        <button type="submit" style={{ color: "#102d39", background: "#a8dedb", border: 0, borderRadius: 4, padding: "10px 16px", cursor: "pointer", fontWeight: 700 }}>Leave Partner Room</button>
      </form>
    </div>
    {children}
  </>;
}
