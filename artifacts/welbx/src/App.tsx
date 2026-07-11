import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PartnerContentProvider } from "@/context/PartnerContentContext";
import { PartnerAccessGate } from "@/components/PartnerAccessGate";

import PartnerRoomLanding from "@/pages/partner-room/PartnerRoomLanding";
import PartnerOverview from "@/pages/partner-room/PartnerOverview";
import PartnerOperatorBrief from "@/pages/partner-room/PartnerOperatorBrief";
import PartnerIntegrationBrief from "@/pages/partner-room/PartnerIntegrationBrief";
import PartnerMomentsEconomy from "@/pages/partner-room/PartnerMomentsEconomy";
import PartnerSignalsEngine from "@/pages/partner-room/PartnerSignalsEngine";
import PartnerPilotModel from "@/pages/partner-room/PartnerPilotModel";
import PartnerCommercialModel from "@/pages/partner-room/PartnerCommercialModel";
import PartnerDemoPaths from "@/pages/partner-room/PartnerDemoPaths";
import PartnerLiveDemos from "@/pages/partner-room/PartnerLiveDemos";
import PartnerGuestDemo from "@/pages/partner-room/PartnerGuestDemo";
import PartnerOperatorDemo from "@/pages/partner-room/PartnerOperatorDemo";
import PartnerDualViewDemo from "@/pages/partner-room/PartnerDualViewDemo";
import PartnerHolidayParkDemo from "@/pages/partner-room/PartnerHolidayParkDemo";
import PartnerDeployments from "@/pages/partner-room/PartnerDeployments";
import PartnerProductProof from "@/pages/partner-room/PartnerProductProof";
import PartnerValidation from "@/pages/partner-room/PartnerValidation";
import PartnerCommercial from "@/pages/partner-room/PartnerCommercial";
import PartnerBriefLibrary from "@/pages/partner-room/PartnerBriefLibrary";
import PartnerNextStep from "@/pages/partner-room/PartnerNextStep";
import PartnerHotelsResortsDemo from "@/pages/partner-room/PartnerHotelsResortsDemo";
import PartnerCorporateTravelDemo from "@/pages/partner-room/PartnerCorporateTravelDemo";
import PartnerEventsVenuesDemo from "@/pages/partner-room/PartnerEventsVenuesDemo";
import PartnerDestinationTourismDemo from "@/pages/partner-room/PartnerDestinationTourismDemo";
import PartnerScenarioBuilder from "@/pages/partner-room/PartnerScenarioBuilder";
import PartnerProofCalculator from "@/pages/partner-room/PartnerProofCalculator";
import PartnerCommsDemo from "@/pages/partner-room/PartnerCommsDemo";
import PartnerTravelAiComms from "@/pages/partner-room/PartnerTravelAiComms";
import PartnerDecisionSpine from "@/pages/partner-room/PartnerDecisionSpine";
import PartnerValidationReplay from "@/pages/partner-room/PartnerValidationReplay";
import PartnerSignalCapture from "@/pages/partner-room/PartnerSignalCapture";
import PartnerStage3Preview from "@/pages/partner-room/PartnerStage3Preview";
import PartnerPilotExpansionPreview from "@/pages/partner-room/PartnerPilotExpansionPreview";
import PartnerOperatingModel from "@/pages/partner-room/PartnerOperatingModel";
import PartnerIntelligenceModel from "@/pages/partner-room/PartnerIntelligenceModel";
import PartnerTravelOperatingSystems from "@/pages/partner-room/PartnerTravelOperatingSystems";
import PartnerBuildConfigure from "@/pages/partner-room/PartnerBuildConfigure";
import PartnerOperationsCentre from "@/pages/partner-room/PartnerOperationsCentre";
import StoryHub from "@/pages/StoryHub";
import StoryOperator from "@/pages/StoryOperator";
import StoryGuestStory from "@/pages/StoryGuestStory";
import TravelPartnershipOverview from "@/pages/partner-room/resources/TravelPartnershipOverview";
import TravelCommercialPartnershipBrief from "@/pages/partner-room/resources/TravelCommercialPartnershipBrief";
import TravelBusinessPlan from "@/pages/partner-room/resources/TravelBusinessPlan";
import TravelGtmPlan from "@/pages/partner-room/resources/TravelGtmPlan";
import TravelCommercialCase from "@/pages/partner-room/resources/TravelCommercialCase";
import TravelUxBlueprint from "@/pages/partner-room/resources/TravelUxBlueprint";
import TravelSystemsMap from "@/pages/partner-room/resources/TravelSystemsMap";
import TravelPilotModel from "@/pages/partner-room/resources/TravelPilotModel";
import TravelRevenueModel from "@/pages/partner-room/resources/TravelRevenueModel";
import TravelDemoLinks from "@/pages/partner-room/resources/TravelDemoLinks";
import TravelAiIntelligenceLayer from "@/pages/partner-room/resources/TravelAiIntelligenceLayer";
import TravelArchitectureModellingUxQa from "@/pages/partner-room/resources/TravelArchitectureModellingUxQa";

const queryClient = new QueryClient();

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
  { path: "/partner-room/commercial-model",   component: PartnerCommercialModel },
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
  { path: "/partner-room/build-configure",    component: PartnerBuildConfigure },
  { path: "/partner-room/operations",         component: PartnerOperationsCentre },
  { path: "/partner-room/resources/travel-partnership-overview",         component: TravelPartnershipOverview },
  { path: "/partner-room/resources/travel-commercial-partnership-brief", component: TravelCommercialPartnershipBrief },
  { path: "/partner-room/resources/travel-business-plan",                component: TravelBusinessPlan },
  { path: "/partner-room/resources/travel-gtm-plan",                     component: TravelGtmPlan },
  { path: "/partner-room/resources/travel-commercial-case",              component: TravelCommercialCase },
  { path: "/partner-room/resources/travel-ux-blueprint",                 component: TravelUxBlueprint },
  { path: "/partner-room/resources/travel-systems-map",                  component: TravelSystemsMap },
  { path: "/partner-room/resources/travel-pilot-model",                  component: TravelPilotModel },
  { path: "/partner-room/resources/travel-revenue-model",                component: TravelRevenueModel },
  { path: "/partner-room/resources/travel-demo-links",                   component: TravelDemoLinks },
  { path: "/partner-room/resources/travel-ai-intelligence-layer",        component: TravelAiIntelligenceLayer },
  { path: "/partner-room/resources/travel-architecture-modelling-ux-qa", component: TravelArchitectureModellingUxQa },
];

function Router() {
  return (
    <Switch>
      {PARTNER_ROUTES.map(({ path, component: Component }) => (
        <Route key={path} path={path} component={Component} />
      ))}
      {/* Operator Story Lab routes */}
      <Route path="/story" component={StoryHub} />
      <Route path="/story/executive-briefing">{() => <Redirect to="/story" />}</Route>
      <Route path="/story/operator-deep-dive" component={StoryOperator} />
      <Route path="/story/live-guest-story" component={StoryGuestStory} />
      <Route>{() => <Redirect to="/partner-room" />}</Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PartnerContentProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <PartnerAccessGate>
              <div className="min-h-[100dvh] bg-background">
                <Router />
              </div>
            </PartnerAccessGate>
          </WouterRouter>
          <Toaster />
        </PartnerContentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
