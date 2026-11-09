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
          <a href="#travel-guest-app">Guest app</a>
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
        <section id="travel-guest-app" className="travel-guest-app" aria-labelledby="travel-guest-app-heading">
          <div className="travel-container">
            <div className="travel-section-heading">
              <div><p className="travel-eyebrow">The guest experience</p><h2 id="travel-guest-app-heading">One connected stay.<br /><span>Powered by JALDO.</span></h2></div>
              <span className="travel-tag">Interactive prototype · Synthetic data</span>
            </div>
            <p className="travel-guest-intro">Behind every guest interaction, JALDO Travel is designed to coordinate the people, systems, decisions and follow-through. See how that operating model comes together in the guest app.</p>
            <div className="travel-guest-screens">
              <figure><div className="travel-guest-phone"><img src={asset("images/guest-app/stay.webp")} alt="Actual guest prototype Stay screen, showing room details, service requests and a discreet support entry." width="530" height="936" loading="lazy" decoding="async" /></div><figcaption><span>01 / Your stay</span><h3>Help, without the chase.</h3><p>Requests, progress and discreet support in one familiar place.</p></figcaption></figure>
              <figure><div className="travel-guest-phone"><img src={asset("images/guest-app/explore.webp")} alt="Actual guest prototype Explore screen, showing activity, dining, fitness and show filters and optional suggestion preferences." width="530" height="936" loading="lazy" decoding="async" /></div><figcaption><span>02 / Explore</span><h3>A little more to the stay.</h3><p>Free and paid experiences, saved favourites and suggestions the guest chooses to receive.</p></figcaption></figure>
              <figure><div className="travel-guest-phone"><img src={asset("images/guest-app/plans.webp")} alt="Actual guest prototype My plans screen, showing the connected arrival story and an unresolved request marked for follow-up." width="530" height="936" loading="lazy" decoding="async" /></div><figcaption><span>03 / My plans</span><h3>Clear about what’s agreed.</h3><p>Enquiries, arrangements, changed plans and outcomes that still need confirmation.</p></figcaption></figure>
            </div>
            <div className="travel-guest-coordination"><p className="travel-eyebrow">One operating model</p><h3>Guest need. Accountable response. Checked outcome.</h3><p>The intended architecture connects JALDO Core OS, its Travel deployment and the guest and staff interfaces. The guest app currently demonstrates this model through scripted interactions; its Core runtime connection is not yet verified.</p></div>
            <div className="travel-guest-actions">
              <span className="travel-tag">Guest experience preview · Sample screens</span>
              <Link href={WORKING_PROOF_PATH} className="travel-text-link">See how the hotel coordinates the response <ArrowUpRight size={18} aria-hidden="true" /></Link>
            </div>
            <div id="travel-guest-access" className="travel-guest-access" tabIndex={-1}>
              <h3>Guest experience preview</h3>
              <p>These sample screens illustrate the standalone guest experience. The guest app remains separate and is not linked from this site at this stage.</p>
              <p className="travel-guest-boundary">Actual screens captured from the branded guest review build. All guests, hotel details, experiences, prices, staff updates and confirmations are fictional. No live booking, payment, hotel messaging or Core integration is implied. Hotel-response proof opens in the Partner Room; existing access controls apply.</p>
            </div>
          </div>
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
            <div><p className="travel-eyebrow">02 / The bigger picture</p><h2 id="travel-stage-heading">Beyond one moment.<br /><span>Across the operation.</span></h2><p>Coordinated Response explores planned coordination across hotels: multiple signal streams, role-specific visibility, action routing and assurance records.</p><p className="travel-stage-boundary">Future-state preview—not the current MVP. Dependent on workflow validation and approved integrations.</p><Link href={STAGE_3_PATH} className="travel-button travel-button-light">See the hotel respond under pressure <ArrowUpRight size={18} aria-hidden="true" /></Link><p className="travel-access-note">Opens in the Partner Room; the existing access gate applies.</p></div>
            <div className="travel-role-preview" aria-label="Overview of roles described in the planned Coordinated Response">
              <div className="travel-preview-top"><Building2 size={21} aria-hidden="true" /><span>Coordinated Response / Role visibility</span><span className="travel-tag">Future state</span></div>
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
