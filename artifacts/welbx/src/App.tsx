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

const queryClient = new QueryClient();

const PARTNER_ROUTES = [
  { path: "/partner-room", component: PartnerRoomLanding },
  { path: "/partner-room/overview", component: PartnerOverview },
  { path: "/partner-room/operator-brief", component: PartnerOperatorBrief },
  { path: "/partner-room/integration-brief", component: PartnerIntegrationBrief },
  { path: "/partner-room/moments-economy", component: PartnerMomentsEconomy },
  { path: "/partner-room/signals-engine", component: PartnerSignalsEngine },
  { path: "/partner-room/pilot-model", component: PartnerPilotModel },
  { path: "/partner-room/commercial-model", component: PartnerCommercialModel },
  { path: "/partner-room/demo-paths", component: PartnerDemoPaths },
  { path: "/partner-room/live-demos", component: PartnerLiveDemos },
  { path: "/partner-room/guest-demo", component: PartnerGuestDemo },
  { path: "/partner-room/operator-demo", component: PartnerOperatorDemo },
  { path: "/partner-room/dual-view-demo", component: PartnerDualViewDemo },
  { path: "/partner-room/holiday-park-demo", component: PartnerHolidayParkDemo },
];

function Router() {
  return (
    <Switch>
      {PARTNER_ROUTES.map(({ path, component: Component }) => (
        <Route key={path} path={path} component={Component} />
      ))}
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
