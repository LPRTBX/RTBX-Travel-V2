import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { AppProvider } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import LiveMoments from "@/pages/LiveMoments";
import SystemState from "@/pages/SystemState";
import OutcomeIntelligence from "@/pages/OutcomeIntelligence";
import ScenarioDemo from "@/pages/ScenarioDemo";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/live-moments" />} />
      <Route path="/live-moments" component={LiveMoments} />
      <Route path="/system-state" component={SystemState} />
      <Route path="/outcome-intelligence" component={OutcomeIntelligence} />
      <Route path="/scenario-demo" component={ScenarioDemo} />
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
