import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { AppLayout } from "@/components/layout/AppLayout";
import Landing from "@/pages/Landing";
import DriverDemo from "@/pages/DriverDemo";
import CivicScore from "@/pages/CivicScore";
import RouteRisk from "@/pages/RouteRisk";
import CityIntel from "@/pages/CityIntel";
import DemoScenario from "@/pages/DemoScenario";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/demo" component={DriverDemo} />
        <Route path="/score" component={CivicScore} />
        <Route path="/route" component={RouteRisk} />
        <Route path="/city" component={CityIntel} />
        <Route path="/scenario" component={DemoScenario} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
