import { Switch, Route } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import CreateTest from "@/pages/CreateTest";
import MarketAnalysis from "@/pages/MarketAnalysis";
import TestResults from "@/pages/TestResults";
import Reports from "@/pages/Reports";
import ModelOperations from "@/pages/ModelOperations";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import MainLayout from "@/components/layout/MainLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/create-test" component={CreateTest} />
      <Route path="/market-analysis" component={MarketAnalysis} />
      <Route path="/test-results" component={TestResults} />
      <Route path="/reports" component={Reports} />
      <Route path="/model-operations" component={ModelOperations} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Router />
      </MainLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
