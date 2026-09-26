import { ArrowRight, ArrowUpRight, Building2, CheckCircle2, Eye, Layers3 } from "lucide-react";
import { Link } from "wouter";
import { CURRENT_PROOF_BOUNDARY, WORKING_PROOF_PATH } from "@/lib/proofLanguage";
import "./Landing.css";

const STAGE_3_PATH = "/partner-room/product-proof/stage-3-operating-layer";
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export default function Landing() {
  return (
    <div id="jaldo-travel-home" className="rtbx-landing-page">
      <a className="travel-skip" href="#travel-main">Skip to content</a>
      <header className="travel-header">
        <Link href="/" className="travel-brand" aria-label="JALDO Travel home">
          <img src={asset("brand/jaldo-logo-white.webp")} alt="JALDO" width="160" height="42" />
          <span>Travel</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/story">The experience</Link>
          <a href="#travel-proof">Working proof</a>
          <Link href="/partner-room" className="travel-nav-partner">Partner Room <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </nav>
      </header>
      <main id="travel-main">
        <section className="travel-hero" aria-labelledby="travel-headline">
          <img className="travel-hero-photo" src={asset("images/travel/arrival-hero.webp")} alt="Illustrative hotel arrival: a concierge welcomes a guest at a warmly lit entrance." width="1672" height="941" fetchPriority="high" />
          <div className="travel-hero-shade" />
          <div className="travel-container travel-hero-content">
            <p className="travel-eyebrow">JALDO Travel / Guest Experience</p>
            <h1 id="travel-headline">Exceptional stays.<br /><span>Intelligently<br />coordinated.</span></h1>
            <p className="travel-hero-intro">Connect guest needs, team decisions and follow-through. Give the people behind every stay a clearer next step.</p>
            <div className="travel-actions">
              <Link href={WORKING_PROOF_PATH} className="travel-button travel-button-light">Explore the working demo <ArrowRight size={19} aria-hidden="true" /></Link>
              <a href="#travel-stage-3" className="travel-text-link">See the bigger picture <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <p className="travel-access-note">Partner Room access code required when enabled. Synthetic demonstration.</p>
          </div>
          <div className="travel-hero-bottom travel-container"><span>People. Decisions. Service.</span><span>Travel &amp; hospitality operating layer</span></div>
        </section>
        <section className="travel-editorial travel-container" aria-labelledby="travel-team-heading">
          <div>
            <p className="travel-eyebrow">Behind the experience</p>
            <h2 id="travel-team-heading">A seamless stay.<br /><span>A connected team.</span></h2>
            <p>A guest sees one hotel. Behind the scenes, front desk, housekeeping and management each hold part of the picture.</p>
            <p>JALDO Travel explores how those signals become a shared understanding, an accountable decision and a recorded response.</p>
            <Link href="/story" className="travel-text-link">The Framework <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <figure>
            <img src={asset("images/travel/team-coordination.webp")} alt="Illustrative hotel team coordinating a response together around a tablet." width="1000" height="750" loading="lazy" decoding="async" />
            <figcaption>Frontline context. Shared understanding. Human decisions.</figcaption>
          </figure>
        </section>
        <section id="travel-proof" className="travel-proof" aria-labelledby="travel-proof-heading">
          <div className="travel-container">
            <div className="travel-section-heading"><div><p className="travel-eyebrow">01 / Explore today</p><h2 id="travel-proof-heading">From a guest moment<br />to a recorded response.</h2></div><span className="travel-tag">Working Proof · Synthetic scenarios</span></div>
            <ol className="travel-proof-steps">
              <li><span className="travel-step-number">01</span><Eye aria-hidden="true" /><h3>Understand the moment</h3><p>Review the guest or operational input and the context around it.</p></li>
              <li><span className="travel-step-number">02</span><Layers3 aria-hidden="true" /><h3>Make the decision visible</h3><p>Explore ownership, response options and the human decision points.</p></li>
              <li><span className="travel-step-number">03</span><CheckCircle2 aria-hidden="true" /><h3>Follow the response through</h3><p>Inspect the simulated action state and its recorded outcome.</p></li>
            </ol>
            <div className="travel-proof-footer"><Link href={WORKING_PROOF_PATH} className="travel-button travel-button-dark">Open Working Proof <ArrowRight size={18} aria-hidden="true" /></Link><p>{CURRENT_PROOF_BOUNDARY.notice}</p></div>
          </div>
        </section>
        <section id="travel-stage-3" className="travel-stage" aria-labelledby="travel-stage-heading">
          <div className="travel-container travel-stage-grid">
            <div><p className="travel-eyebrow">02 / The bigger picture</p><h2 id="travel-stage-heading">Beyond one moment.<br /><span>Across the operation.</span></h2><p>The Stage 3 preview explores an intended multi-site operating layer: multiple signal streams, role-specific visibility, action routing and assurance records.</p><p className="travel-stage-boundary">Future-state preview—not the current MVP. Dependent on workflow validation and approved integrations.</p><Link href={STAGE_3_PATH} className="travel-button travel-button-light">Explore Stage 3 preview <ArrowUpRight size={18} aria-hidden="true" /></Link><p className="travel-access-note">Opens in the Partner Room; the existing access gate applies.</p></div>
            <div className="travel-role-preview" aria-label="Overview of roles described in the future-state Stage 3 preview">
              <div className="travel-preview-top"><Building2 size={21} aria-hidden="true" /><span>Stage 3 / Role visibility</span><span className="travel-tag">Future state</span></div>
              <div><span className="travel-role-index">01</span><h3>Frontline staff</h3><p>Assigned actions and escalation guidance.</p></div>
              <div><span className="travel-role-index">02</span><h3>Property manager</h3><p>Open moments, overdue actions and site visibility.</p></div>
              <div><span className="travel-role-index">03</span><h3>Operator executive</h3><p>Patterns and evidence across multiple properties.</p></div>
              <p className="travel-preview-caption">Overview of the intended model. No live property data.</p>
            </div>
          </div>
        </section>
        <section className="travel-closing travel-container" aria-labelledby="travel-closing-heading"><div><p className="travel-eyebrow">Explore with purpose</p><h2 id="travel-closing-heading">See the experience.<br />Understand the operating layer.</h2></div><div><Link href="/partner-room" className="travel-button travel-button-dark">Enter the Operating Layer <ArrowRight size={18} aria-hidden="true" /></Link><Link href="/story/operator" className="travel-text-link">Read the operator story <ArrowUpRight size={17} aria-hidden="true" /></Link></div></section>
      </main>
      <footer className="travel-footer"><div className="travel-container"><div><strong>JALDO Travel</strong><span>Guest Experience · Behavioural Infrastructure</span></div><p>Illustrative AI-generated hospitality imagery; no customer deployment or endorsement implied.</p></div></footer>
    </div>
  );
}
