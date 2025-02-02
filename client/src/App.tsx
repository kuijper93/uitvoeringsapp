import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Shell } from "@/components/layout/Shell";

// Pages
import Dashboard from "./pages/dashboard";
import Requests from "./pages/requests";
import CreateRequest from "./pages/create-request";
import RequestDetails from "./pages/request-details";
import Objects from "./pages/objects";
import InternalRequests from "./pages/internal-requests";
import NotFound from "./pages/not-found";
import { ObjectDetails } from "./components/ObjectDetails";

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/requests" component={Requests} />
        <Route path="/requests/:id" component={RequestDetails} />
        <Route path="/create-request" component={CreateRequest} />
        <Route path="/objects" component={() => (
          <div className="container mx-auto p-4">
            <ObjectDetails />
          </div>
        )} />
        <Route path="/internal-requests" component={InternalRequests} />
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