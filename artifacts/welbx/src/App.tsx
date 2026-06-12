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
      <Route path="/compare" component={CompareMode} />
      <Route path="/command-mode" component={CommandMode} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppShell() {
  const [location] = useLocation();
  const isPresentation = location.startsWith("/presentation-mode") || location.startsWith("/story");
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
