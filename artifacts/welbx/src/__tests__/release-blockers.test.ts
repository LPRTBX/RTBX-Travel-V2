import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("JALDO Travel release blocker regressions", () => {
  const app = source("src/App.tsx");
  const landing = source("src/pages/Landing.tsx");
  const layout = source("src/components/PartnerRoomLayout.tsx");
  const operations = source("src/pages/partner-room/PartnerOperationsCentre.tsx");

  it("registers the public homepage and canonical story routes outside the Partner Room gate", () => {
    expect(app).toContain('<Route path="/" component={Landing} />');
    expect(app).toContain('<Route path="/story" component={StoryHub} />');
    expect(app).toContain('<Route path="/story/operator" component={StoryOperator} />');
    expect(app).toContain('<Route path="/story/guest" component={StoryGuestStory} />');
    expect(app.indexOf('<Route path="/" component={Landing} />')).toBeLessThan(app.indexOf("PARTNER_ROUTES.map"));
  });

  it("keeps both homepage CTAs pointed at registered routes", () => {
    const registeredRoutes = [
      ...app.matchAll(/path\s*(?::|=)\s*["']([^"']+)["']/g),
    ].map((match) => match[1]);

    expect(landing).toMatch(/<Link[^>]+href="\/partner-room"[^>]*>Enter the Operating Layer/);
    expect(landing).toMatch(/<Link[^>]+href="\/story"[^>]*>The Framework/);
    expect(registeredRoutes).toContain("/partner-room");
    expect(registeredRoutes).toContain("/story");
  });

  it("keeps the public Landing structure responsive at narrow widths", () => {
    const styles = source("src/pages/Landing.css");

    expect(landing).toContain('className="rtbx-landing-page"');
    expect(landing).toContain('className="travel-header"');
    expect(landing).toContain('id="travel-main"');
    expect(landing).toContain('className="travel-actions"');
    expect(landing).toContain('className="travel-footer"');
    expect(styles).toContain("@media(max-width:640px)");
    expect(styles).toContain("grid-template-columns:minmax(0,1fr)");
    expect(styles).toContain("flex-wrap:wrap");
    expect(styles).toContain("flex-direction:column");
  });

  it("keeps the commercial page outside the runtime route and import graph", () => {
    expect(app).not.toContain('import PartnerCommercial from');
    expect(app).not.toContain('path: "/partner-room/commercial"');
    expect(app).not.toContain('path: "/partner-room/commercial-model"');
    expect(layout).not.toContain('path: "/partner-room/commercial"');
  });

  it("uses retryable offset hash scrolling for direct and repeated Evidence navigation", () => {
    expect(layout).toContain("schedulePartnerRoomHashScroll");
    expect(layout).toContain("window.scrollTo");
    expect(layout).toContain("PARTNER_ROOM_SCROLL_CLEARANCE");
    expect(layout).toContain('scrollToPartnerRoomHash(hash, "auto")');
    expect(layout).toContain("attempt < delays.length");
    expect(operations).toContain('schedulePartnerRoomHashScroll(hash, "auto")');
    expect(operations).toContain('id="outcome-ledger"');
  });

  it("keeps the restored Story Hub responsive with stable card keys", () => {
    const story = source("src/pages/StoryHub.tsx");
    const styles = source("src/index.css");
    expect(story).toContain('className="rtbx-story-page"');
    expect(story).toContain('className="rtbx-story-grid"');
    expect(story).toContain('key={`${mode.path}-${mode.label}`}');
    expect(story).toContain('flexWrap: "wrap"');
    expect(styles).toContain(".rtbx-story-grid");
    expect(styles).toContain("grid-template-columns: minmax(0, 1fr) !important");
  });

  it("contains wide Operations content within local responsive scrollers", () => {
    expect(operations).toContain('className="rtbx-responsive-page rtbx-page-pad"');
    expect(operations).toContain('className="rtbx-table-scroll"');
    expect(operations).not.toContain("flex: 1, minWidth: 240");
  });

  it("uses native evidence checkboxes and semantic outcome buttons", () => {
    expect(operations).toContain('type="checkbox"');
    expect(operations).toContain("aria-required={ev.required}");
    expect(operations).toContain('role="group"');
    expect(operations).toContain("aria-pressed={o.status === s}");
    expect(operations).toContain("const operatorPanel = (");
    expect(operations).not.toContain("const OperatorPanel = () =>");
    expect(operations).not.toContain("onClick={() => handleEvidence(ev.id, !ev.captured)}");
  });
});
