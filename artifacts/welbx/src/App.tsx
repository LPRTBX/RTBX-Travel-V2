import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PartnerContentProvider } from "@/context/PartnerContentContext";
import { PartnerAccessGate } from "@/components/PartnerAccessGate";
import { DeploymentProvider } from "@/context/DeploymentContext";

// ── Critical-path routes (eager) ────────────────────────────────────────────
// These are the first pages a partner sees; keep them in the main bundle.
import PartnerRoomLanding from "@/pages/partner-room/PartnerRoomLanding";
import PartnerOverview from "@/pages/partner-room/PartnerOverview";
import PartnerDeployments from "@/pages/partner-room/PartnerDeployments";
import PartnerProductProof from "@/pages/partner-room/PartnerProductProof";
import PartnerValidation from "@/pages/partner-room/PartnerValidation";
import PartnerCommercial from "@/pages/partner-room/PartnerCommercial";
import PartnerBriefLibrary from "@/pages/partner-room/PartnerBriefLibrary";
import PartnerNextStep from "@/pages/partner-room/PartnerNextStep";
import PartnerOperatorBrief from "@/pages/partner-room/PartnerOperatorBrief";
import PartnerIntegrationBrief from "@/pages/partner-room/PartnerIntegrationBrief";
import PartnerMomentsEconomy from "@/pages/partner-room/PartnerMomentsEconomy";
import PartnerSignalsEngine from "@/pages/partner-room/PartnerSignalsEngine";
import PartnerPilotModel from "@/pages/partner-room/PartnerPilotModel";
import PartnerDemoPaths from "@/pages/partner-room/PartnerDemoPaths";
import PartnerLiveDemos from "@/pages/partner-room/PartnerLiveDemos";
import PartnerGuestDemo from "@/pages/partner-room/PartnerGuestDemo";
import PartnerOperatorDemo from "@/pages/partner-room/PartnerOperatorDemo";
import PartnerDualViewDemo from "@/pages/partner-room/PartnerDualViewDemo";
import PartnerBuildConfigure from "@/pages/partner-room/PartnerBuildConfigure";
import PartnerOperationsCentre from "@/pages/partner-room/PartnerOperationsCentre";
import PartnerTravelScenarios from "@/pages/partner-room/PartnerTravelScenarios";
import PartnerCommsDemo from "@/pages/partner-room/PartnerCommsDemo";
import PartnerTravelAiComms from "@/pages/partner-room/PartnerTravelAiComms";
import PartnerOperatingModel from "@/pages/partner-room/PartnerOperatingModel";
import PartnerIntelligenceModel from "@/pages/partner-room/PartnerIntelligenceModel";
import PartnerTravelOperatingSystems from "@/pages/partner-room/PartnerTravelOperatingSystems";
import PartnerEcosystem from "@/pages/partner-room/PartnerEcosystem";
import PartnerRolloutModel from "@/pages/partner-room/PartnerRolloutModel";

// ── Secondary routes (lazy) ──────────────────────────────────────────────────
// Deployment demo verticals, product proof utilities, and approved resource
// pages are loaded on demand. Internal/restricted material is not imported.

// Deployment vertical demos
const PartnerHolidayParkDemo       = lazy(() => import("@/pages/partner-room/PartnerHolidayParkDemo"));
const PartnerHotelsResortsDemo     = lazy(() => import("@/pages/partner-room/PartnerHotelsResortsDemo"));
const PartnerCorporateTravelDemo   = lazy(() => import("@/pages/partner-room/PartnerCorporateTravelDemo"));
const PartnerEventsVenuesDemo      = lazy(() => import("@/pages/partner-room/PartnerEventsVenuesDemo"));
const PartnerDestinationTourismDemo = lazy(() => import("@/pages/partner-room/PartnerDestinationTourismDemo"));

// Product proof utilities
const PartnerScenarioBuilder       = lazy(() => import("@/pages/partner-room/PartnerScenarioBuilder"));
const PartnerProofCalculator       = lazy(() => import("@/pages/partner-room/PartnerProofCalculator"));
const PartnerDecisionSpine         = lazy(() => import("@/pages/partner-room/PartnerDecisionSpine"));
const PartnerValidationReplay      = lazy(() => import("@/pages/partner-room/PartnerValidationReplay"));
const PartnerSignalCapture         = lazy(() => import("@/pages/partner-room/PartnerSignalCapture"));
const PartnerStage3Preview         = lazy(() => import("@/pages/partner-room/PartnerStage3Preview"));
const PartnerPilotExpansionPreview = lazy(() => import("@/pages/partner-room/PartnerPilotExpansionPreview"));

// Resource library (appendix documents)
const TravelPartnershipOverview           = lazy(() => import("@/pages/partner-room/resources/TravelPartnershipOverview"));
const TravelUxBlueprint                   = lazy(() => import("@/pages/partner-room/resources/TravelUxBlueprint"));
const TravelSystemsMap                    = lazy(() => import("@/pages/partner-room/resources/TravelSystemsMap"));
const TravelPilotModel                    = lazy(() => import("@/pages/partner-room/resources/TravelPilotModel"));
const TravelDemoLinks                     = lazy(() => import("@/pages/partner-room/resources/TravelDemoLinks"));
const TravelAiIntelligenceLayer           = lazy(() => import("@/pages/partner-room/resources/TravelAiIntelligenceLayer"));
const TravelArchitectureModellingUxQa     = lazy(() => import("@/pages/partner-room/resources/TravelArchitectureModellingUxQa"));

// ────────────────────────────────────────────────────────────────────────────

const queryClient = new QueryClient();

/** Minimal fallback shown while a lazy chunk loads. */
const PageFallback = () => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", background: "#0a0a0a", color: "rgba(255,255,255,0.3)",
    fontSize: 13, fontFamily: "sans-serif", letterSpacing: "0.05em",
  }}>
    Loading…
  </div>
);

const PARTNER_ROUTES = [
  { path: "/partner-room",                    component: PartnerRoomLanding },
  { path: "/partner-room/overview",           component: PartnerOverview },
  { path: "/partner-room/deployments",        component: PartnerDeployments },
  { path: "/partner-room/product-proof",      component: PartnerProductProof },
  { path: "/partner-room/validation",         component: PartnerValidation },
  { path: "/partner-room/commercial",         component: PartnerCommercial },
  { path: "/partner-room/brief-library",      component: PartnerBriefLibrary },
  { path: "/partner-room/next-step",          component: PartnerNextStep },
  { path: "/partner-room/operator-brief",     component: PartnerOperatorBrief },
  { path: "/partner-room/integration-brief",  component: PartnerIntegrationBrief },
  { path: "/partner-room/moments-economy",    component: PartnerMomentsEconomy },
  { path: "/partner-room/signals-engine",     component: PartnerSignalsEngine },
  { path: "/partner-room/pilot-model",        component: PartnerPilotModel },
  { path: "/partner-room/commercial-model",   component: () => <Redirect to="/partner-room/commercial" /> },
  { path: "/partner-room/demo-paths",         component: PartnerDemoPaths },
  { path: "/partner-room/live-demos",         component: PartnerLiveDemos },
  { path: "/partner-room/guest-demo",         component: PartnerGuestDemo },
  { path: "/partner-room/operator-demo",      component: PartnerOperatorDemo },
  { path: "/partner-room/dual-view-demo",     component: PartnerDualViewDemo },
  { path: "/partner-room/holiday-park-demo",                         component: PartnerHolidayParkDemo },
  { path: "/partner-room/deployments/hotels-resorts/demo",           component: PartnerHotelsResortsDemo },
  { path: "/partner-room/deployments/corporate-travel/demo",         component: PartnerCorporateTravelDemo },
  { path: "/partner-room/deployments/events-venues/demo",            component: PartnerEventsVenuesDemo },
  { path: "/partner-room/deployments/destination-tourism/demo",      component: PartnerDestinationTourismDemo },
  { path: "/partner-room/scenario-builder",                          component: PartnerScenarioBuilder },
  { path: "/partner-room/proof-calculator",   component: PartnerProofCalculator },
  { path: "/partner-room/comms-demo",         component: PartnerCommsDemo },
  { path: "/partner-room/travel-ai-comms",    component: PartnerTravelAiComms },
  { path: "/travel-ai-comms",                 component: PartnerTravelAiComms },
  { path: "/partner-room/decision-spine",     component: PartnerDecisionSpine },
  { path: "/partner-room/validation-replay",  component: PartnerValidationReplay },
  { path: "/partner-room/product-proof/signal-capture",          component: PartnerSignalCapture },
  { path: "/partner-room/product-proof/stage-3-operating-layer",  component: PartnerStage3Preview },
  { path: "/partner-room/product-proof/pilot-expansion-preview",  component: PartnerPilotExpansionPreview },
  { path: "/partner-room/operating-model",    component: PartnerOperatingModel },
  { path: "/partner-room/intelligence-model", component: PartnerIntelligenceModel },
  { path: "/partner-room/travel-intelligence", component: PartnerIntelligenceModel },
  { path: "/travel-intelligence",              component: PartnerIntelligenceModel },
  { path: "/partner-room/travel-operating-systems", component: PartnerTravelOperatingSystems },
  { path: "/travel-operating-systems",              component: PartnerTravelOperatingSystems },
  { path: "/travel-action-centre", component: () => <Redirect to="/partner-room/operations#action-centre" /> },
  { path: "/travel-outcomes",      component: () => <Redirect to="/partner-room/operations#outcome-ledger" /> },
  { path: "/travel-value",         component: () => <Redirect to="/partner-room/operations#value-dashboard" /> },
  { path: "/partner-room/build-configure",    component: PartnerBuildConfigure },
  { path: "/partner-room/operations",         component: PartnerOperationsCentre },
  { path: "/partner-room/travel-scenarios/:scenarioId", component: PartnerTravelScenarios },
  { path: "/partner-room/travel-scenarios",   component: PartnerTravelScenarios },
  { path: "/travel-scenarios/:scenarioId",    component: PartnerTravelScenarios },
  { path: "/travel-scenarios",                component: PartnerTravelScenarios },
  { path: "/partner-room/rollout-model",      component: PartnerRolloutModel },
  { path: "/partner-room/partner-ecosystem",  component: PartnerEcosystem },
  { path: "/partner-room/resources/travel-partnership-overview",         component: TravelPartnershipOverview },
  { path: "/partner-room/resources/travel-ux-blueprint",                 component: TravelUxBlueprint },
  { path: "/partner-room/resources/travel-systems-map",                  component: TravelSystemsMap },
  { path: "/partner-room/resources/travel-pilot-model",                  component: TravelPilotModel },
  { path: "/partner-room/resources/travel-demo-links",                   component: TravelDemoLinks },
  { path: "/partner-room/resources/travel-ai-intelligence-layer",        component: TravelAiIntelligenceLayer },
  { path: "/partner-room/resources/travel-architecture-modelling-ux-qa", component: TravelArchitectureModellingUxQa },
];

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        {PARTNER_ROUTES.map(({ path, component: Component }) => (
          <Route key={path} path={path} component={Component} />
        ))}
        {/* Internal Story Lab is preserved in source but excluded from the external route tree. */}
        <Route>{() => <Redirect to="/partner-room" />}</Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DeploymentProvider>
          <PartnerContentProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <div className="rtbx-readable-content">
                <PartnerAccessGate>
                  <div className="min-h-[100dvh] bg-background">
                    <Router />
                  </div>
                </PartnerAccessGate>
              </div>
            </WouterRouter>
            <Toaster />
          </PartnerContentProvider>
        </DeploymentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
