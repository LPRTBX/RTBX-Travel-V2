import { createRoot } from "react-dom/client";
import { WellbeingSupportScenario } from "@/components/partner-room/WellbeingSupportScenario";
import "./page.css";

function PublicWellbeing() {
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
        <WellbeingSupportScenario />
      </main>
      <footer className="pw-footer"><a href="/#wellbeing-support">Return to the public overview</a></footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<PublicWellbeing />);
