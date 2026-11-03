import { createRoot } from "react-dom/client";
import { useState } from "react";
import { WellbeingSupportScenario } from "@/components/partner-room/WellbeingSupportScenario";
import { SafeguardingScenario } from "./SafeguardingScenario";
import "./page.css";

function PublicWellbeing() {
  const [scenario, setScenario] = useState(() => new URLSearchParams(window.location.search).get("scenario") === "unsafe" ? "unsafe" : "practical");
  const choose = (next: string) => {
    setScenario(next);
    const url = new URL(window.location.href);
    url.searchParams.set("scenario", next);
    window.history.replaceState(null, "", url);
  };
  return (
    <>
      <a className="pw-skip" href="#walkthrough">Skip to the demonstration</a>
      <header className="pw-header">
        <a className="pw-brand" href="/" aria-label="JALDO Travel public overview">
          <img src="/brand/jaldo-logo-white.webp" alt="JALDO" width="120" />
          <span>TRAVEL</span>
        </a>
        <nav aria-label="Public demonstration navigation">
          <a href="/">Public overview</a>
          <a href="/public-demo#sample-demo">Hotel room demo</a>
        </nav>
      </header>
      <main id="walkthrough" tabIndex={-1}>
        <h1 className="pw-sr">Coordinate wellbeing support — public fictional walkthrough</h1>
        <div className="pw-choice wbs" role="group" aria-label="Choose a fictional wellbeing scenario">
          <h2>Choose a wellbeing story</h2>
          <div className="wbs-tabs">
            <button className="wbs-role" type="button" aria-pressed={scenario === "practical"} onClick={() => choose("practical")}>Practical guest support</button>
            <button className="wbs-role" type="button" aria-pressed={scenario === "unsafe"} onClick={() => choose("unsafe")}>Guest feels unsafe</button>
          </div>
          <p>Two fictional situations. Each keeps its own progress, role view and reset.</p>
        </div>
        <div hidden={scenario !== "practical"}><WellbeingSupportScenario /></div>
        <div hidden={scenario !== "unsafe"}><SafeguardingScenario /></div>
      </main>
      <footer className="pw-footer"><a href="/#wellbeing-support">Return to the public overview</a></footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<PublicWellbeing />);
