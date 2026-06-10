import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { AppProvider } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
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
import GHSOL from "@/pages/GHSOL";
import SignalRegistry from "@/pages/SignalRegistry";
import BehaviouralGenome from "@/pages/BehaviouralGenome";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
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
      <Route path="/ghsol" component={GHSOL} />
      <Route path="/signal-registry" component={SignalRegistry} />
      <Route path="/behavioural-genome" component={BehaviouralGenome} />
      <Route path="/compare" component={CompareMode} />
      <Route path="/command-mode" component={CommandMode} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <div className="min-h-[100dvh] bg-background">
              <Sidebar />
              <Router />
            </div>
          </WouterRouter>
          <Toaster />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
