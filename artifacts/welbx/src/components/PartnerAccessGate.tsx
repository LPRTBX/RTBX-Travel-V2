import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { readSessionResponse, signInHref, type PartnerSession, type SessionCheck } from "@/lib/partnerSession";
import { TravelWordmark } from "@/components/TravelWordmark";
import "./partner-access-gate.css";

type Problem = Exclude<SessionCheck["kind"], "ok" | "sign-in">;

const PROBLEMS: Record<Problem, { title: string; body: string; signIn: boolean }> = {
  network: {
    title: "We can't reach the Partner Room",
    body: "Your browser could not contact the JALDO Travel server. Check your connection, then try again.",
    signIn: false,
  },
  unavailable: {
    title: "Partner access is temporarily unavailable",
    body: "The server could not confirm your session just now. Try again in a moment. If it keeps happening, sign in again.",
    signIn: true,
  },
  unexpected: {
    title: "Your session could not be confirmed",
    body: "The server's reply was not a Partner Room session check, so no partner material has been shown. Try again; if this persists, sign in again. On a preview, restart the Travel workflow so the access-checking server answers.",
    signIn: true,
  },
};

/** Session UI only. Anything other than a confirmed session shows no partner content. */
export function PartnerAccessGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PartnerSession>();
  const [problem, setProblem] = useState<Problem>();
  const [checking, setChecking] = useState(false);
  const runRef = useRef<() => Promise<void>>(async () => {});
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let live = true;
    let timer: ReturnType<typeof setTimeout>;
    const hide = () => { const root = document.getElementById("root"); if (root) root.style.visibility = "hidden"; };
    const entry = () => { hide(); window.location.replace(signInHref(window.location)); };
    const run = async () => {
      setChecking(true);
      // The only network request in the Partner Room. The Node server protects HTML, assets and data first.
      let result: SessionCheck;
      try {
        result = await readSessionResponse(await fetch("/partner-session", { cache: "no-store", credentials: "same-origin" }));
      } catch {
        result = { kind: "network" };
      }
      if (!live) return;
      setChecking(false);
      if (result.kind === "sign-in") return entry();
      if (result.kind !== "ok") { setSession(undefined); setProblem(result.kind); return; }
      setSession(result.session);
      setProblem(undefined);
      clearTimeout(timer);
      timer = setTimeout(entry, result.session.expiresAt - Date.now());
    };
    runRef.current = run;
    void run();
    const interval = setInterval(run, 30_000);
    const focus = () => void run();
    const restored = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload(); };
    window.addEventListener("focus", focus);
    window.addEventListener("pageshow", restored);
    window.addEventListener("pagehide", hide);
    return () => { live = false; clearTimeout(timer); clearInterval(interval); window.removeEventListener("focus", focus); window.removeEventListener("pageshow", restored); window.removeEventListener("pagehide", hide); };
  }, []);

  // Move focus to the explanation when a problem appears, so it is announced and the actions follow it.
  useEffect(() => { if (problem) headingRef.current?.focus(); }, [problem]);

  const retry = useCallback(() => { void runRef.current(); }, []);

  if (!session) {
    const detail = problem && PROBLEMS[problem];
    return <main className="partner-gate" data-testid="partner-gate" data-state={problem ?? "checking"}>
      <div className="partner-gate-card">
        <TravelWordmark />
        <p className="partner-gate-kicker">Controlled Partner Preview</p>
        {detail ? <>
          <h1 ref={headingRef} tabIndex={-1}>{detail.title}</h1>
          <p>{detail.body}</p>
          <div className="partner-gate-actions">
            <button type="button" className="partner-gate-primary" onClick={retry} disabled={checking} aria-describedby="partner-gate-checking">
              {checking ? "Checking…" : "Try again"}
            </button>
            {detail.signIn && <a className="partner-gate-secondary" href={signInHref(window.location, false)}>Sign in again</a>}
            <a className="partner-gate-link" href="/">Return to the public overview</a>
          </div>
          <p id="partner-gate-checking" className="partner-gate-status" role="status">{checking ? "Checking your partner session…" : ""}</p>
        </> : <>
          <h1>Opening the Partner Room</h1>
          <p className="partner-gate-status" role="status">Checking your partner session…</p>
          <a className="partner-gate-link" href="/">Return to the public overview</a>
        </>}
        <p className="partner-gate-note">Sessions last 30 minutes. Partner material appears only after the server confirms your session.</p>
      </div>
    </main>;
  }
  return <>
    <div className="partner-session-bar">
      <span>Partner Room · session ends {new Date(session.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      <form method="post" action="/partner-logout" onSubmit={() => { localStorage.clear(); sessionStorage.clear(); }}>
        <input type="hidden" name="csrf" value={session.csrf} />
        <button type="submit">Leave Partner Room</button>
      </form>
    </div>
    {children}
  </>;
}
