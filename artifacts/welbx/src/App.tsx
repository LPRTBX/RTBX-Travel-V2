import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { AppProvider } from "@/context/AppContext";
import { InterventionUsageProvider } from "@/context/InterventionUsageContext";
import { CcProvider } from "@/context/CcContext";
import { Sidebar } from "@/components/Sidebar";
import { GlobalSearch } from "@/components/GlobalSearch";
import PresentationMode from "@/pages/PresentationMode";
import Presentation5Min from "@/pages/Presentation5Min";
import Presentation15Min from "@/pages/Presentation15Min";
import StoryHub from "@/pages/StoryHub";
import StoryOperator from "@/pages/StoryOperator";
import StoryGuestStory from "@/pages/StoryGuestStory";
import ScenarioReplayLab from "@/pages/ScenarioReplayLab";
import ScenarioStepRunner from "@/pages/ScenarioStepRunner";
import ScenarioScorecard from "@/pages/ScenarioScorecard";
import Landing from "@/pages/Landing";
import LiveDemo from "@/pages/LiveDemo";
import LiveMoments from "@/pages/LiveMoments";
import SystemState from "@/pages/SystemState";
import OutcomeIntelligence from "@/pages/OutcomeIntelligence";
import ScenarioDemo from "@/pages/ScenarioDemo";
import CompareMode from "@/pages/CompareMode";
import CommandMode from "@/pages/CommandMode";
import GuestLayer from "@/pages/GuestLayer";
import SignalIntelligence from "@/pages/SignalIntelligence";
import CommandCentre from "@/pages/CommandCentre";
import ExecutionTimeline from "@/pages/ExecutionTimeline";
import ExecutiveDashboard from "@/pages/ExecutiveDashboard";
import MomentRegistry from "@/pages/MomentRegistry";
import MomentIntelligence from "@/pages/MomentIntelligence";
import StrategicVisibility from "@/pages/StrategicVisibility";
import GHSOL from "@/pages/GHSOL";
import SignalRegistry from "@/pages/SignalRegistry";
import BehaviouralGenome from "@/pages/BehaviouralGenome";
import PlaybookEngine from "@/pages/PlaybookEngine";
import DecisionRegistry from "@/pages/DecisionRegistry";
import InterventionLibrary from "@/pages/InterventionLibrary";
import ExecutionIndex from "@/pages/ExecutionIndex";
import ConsistencyEngine from "@/pages/ConsistencyEngine";
import EnvironmentHealthIndex from "@/pages/EnvironmentHealthIndex";
import EnvironmentHealthDetail from "@/pages/EnvironmentHealthDetail";
import CentralCommunicationsSystem from "@/pages/CentralCommunicationsSystem";
import CommunicationRegistry from "@/pages/CommunicationRegistry";
import CommunicationIntelligence from "@/pages/CommunicationIntelligence";
import OutcomeRegistry from "@/pages/OutcomeRegistry";
import LearningLayer from "@/pages/LearningLayer";
import CausalTrace from "@/pages/CausalTrace";
import ValueProof from "@/pages/ValueProof";
import ShadowPilotMode from "@/pages/ShadowPilotMode";
import ScenarioValidationDashboard from "@/pages/ScenarioValidationDashboard";
import ValidationSummary from "@/pages/ValidationSummary";
import ExportReports from "@/pages/ExportReports";
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

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/presentation-mode" component={PresentationMode} />
      <Route path="/presentation-mode/5-minute" component={Presentation5Min} />
      <Route path="/presentation-mode/15-minute" component={Presentation15Min} />
      <Route path="/story" component={StoryHub} />
      <Route path="/story/executive-briefing" component={Presentation5Min} />
      <Route path="/story/operator-deep-dive" component={StoryOperator} />
      <Route path="/story/live-guest-story" component={StoryGuestStory} />
      <Route path="/scenario-replay-lab/:id/scorecard" component={ScenarioScorecard} />
      <Route path="/scenario-replay-lab/:id" component={ScenarioStepRunner} />
      <Route path="/scenario-replay-lab" component={ScenarioReplayLab} />
      <Route path="/" component={Landing} />
      <Route path="/demo" component={LiveDemo} />
      <Route path="/live-moments" component={LiveMoments} />
      <Route path="/system-state" component={SystemState} />
      <Route path="/outcome-intelligence" component={OutcomeIntelligence} />
      <Route path="/scenario-demo" component={ScenarioDemo} />
      <Route path="/guest-layer" component={GuestLayer} />
      <Route path="/signal-intelligence" component={SignalIntelligence} />
      <Route path="/command-centre" component={CommandCentre} />
      <Route path="/execution-timeline" component={ExecutionTimeline} />
      <Route path="/executive-dashboard" component={ExecutiveDashboard} />
      <Route path="/moment-registry" component={MomentRegistry} />
      <Route path="/moment-intelligence" component={MomentIntelligence} />
      <Route path="/strategic-visibility" component={StrategicVisibility} />
      <Route path="/ghsol" component={GHSOL} />
      <Route path="/signal-registry" component={SignalRegistry} />
      <Route path="/behavioural-genome" component={BehaviouralGenome} />
      <Route path="/playbook-engine" component={PlaybookEngine} />
      <Route path="/decision-registry" component={DecisionRegistry} />
      <Route path="/intervention-library" component={InterventionLibrary} />
      <Route path="/execution-index" component={ExecutionIndex} />
      <Route path="/consistency-engine" component={ConsistencyEngine} />
      <Route path="/environment-health" component={EnvironmentHealthIndex} />
      <Route path="/environment-health/:dimensionId" component={EnvironmentHealthDetail} />
      <Route path="/communications" component={CentralCommunicationsSystem} />
      <Route path="/communication-registry" component={CommunicationRegistry} />
      <Route path="/communication-intelligence" component={CommunicationIntelligence} />
      <Route path="/outcome-registry" component={OutcomeRegistry} />
      <Route path="/learning-layer" component={LearningLayer} />
      <Route path="/causal-trace" component={CausalTrace} />
      <Route path="/value-proof" component={ValueProof} />
      <Route path="/shadow-pilot-mode" component={ShadowPilotMode} />
      <Route path="/scenario-validation-dashboard" component={ScenarioValidationDashboard} />
      <Route path="/validation-summary" component={ValidationSummary} />
      <Route path="/export-reports" component={ExportReports} />
      <Route path="/compare" component={CompareMode} />
      <Route path="/command-mode" component={CommandMode} />
      <Route path="/partner-room" component={PartnerRoomLanding} />
      <Route path="/partner-room/overview" component={PartnerOverview} />
      <Route path="/partner-room/operator-brief" component={PartnerOperatorBrief} />
      <Route path="/partner-room/integration-brief" component={PartnerIntegrationBrief} />
      <Route path="/partner-room/moments-economy" component={PartnerMomentsEconomy} />
      <Route path="/partner-room/signals-engine" component={PartnerSignalsEngine} />
      <Route path="/partner-room/pilot-model" component={PartnerPilotModel} />
      <Route path="/partner-room/commercial-model" component={PartnerCommercialModel} />
      <Route path="/partner-room/demo-paths" component={PartnerDemoPaths} />
      <Route path="/partner-room/live-demos" component={PartnerLiveDemos} />
      <Route path="/partner-room/guest-demo" component={PartnerGuestDemo} />
      <Route path="/partner-room/operator-demo" component={PartnerOperatorDemo} />
      <Route path="/partner-room/dual-view-demo" component={PartnerDualViewDemo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppShell() {
  const [location] = useLocation();
  const isPresentation = location.startsWith("/presentation-mode") || location.startsWith("/story") || location.startsWith("/partner-room");
  return (
    <div className="min-h-[100dvh] bg-background">
      {!isPresentation && <Sidebar />}
      {!isPresentation && <GlobalSearch />}
      <Router />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <CcProvider>
          <InterventionUsageProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppShell />
            </WouterRouter>
            <Toaster />
          </InterventionUsageProvider>
          </CcProvider>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
