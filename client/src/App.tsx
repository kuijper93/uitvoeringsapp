import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Shell } from "@/components/layout/Shell";
import Dashboard from "@/pages/dashboard";
import WorkOrders from "@/pages/work-orders";
import CreateOrder from "@/pages/create-order";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/work-orders" component={WorkOrders} />
        <Route path="/work-orders/new" component={CreateOrder} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
