import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Shell } from "@/components/layout/Shell";

// Pages
import Dashboard from "./pages/dashboard";
import Requests from "./pages/requests";
import CreateRequest from "./pages/create-request";
import WorkOrders from "./pages/work-orders";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/requests" component={Requests} />
        <Route path="/create-request" component={CreateRequest} />
        <Route path="/work-orders" component={WorkOrders} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}