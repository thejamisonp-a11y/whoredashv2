import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/useAuth";

// Pages
import Landing from "@/pages/landing";
import Browse from "@/pages/browse";
import CompanionProfile from "@/pages/companion/[id]";
import BookingFlow from "@/pages/booking/flow";
import ClientDashboard from "@/pages/client/dashboard";
import CompanionDashboard from "@/pages/companion/dashboard";
import AdminDashboard from "@/pages/admin/dashboard";
import About from "@/pages/about";
import FAQ from "@/pages/faq";
import Contact from "@/pages/contact";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If there's an auth error, treat as not authenticated
  const userIsAuthenticated = isAuthenticated && !error;

  return (
    <Switch>
      {/* Public routes - accessible to everyone */}
      <Route path="/" component={userIsAuthenticated ? Browse : Landing} />
      <Route path="/browse" component={Browse} />
      <Route path="/companion/:id" component={CompanionProfile} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      
      {/* Protected routes - require authentication */}
      <Route path="/booking/flow" component={BookingFlow} />
      <Route path="/client/dashboard" component={ClientDashboard} />
      <Route path="/companion/dashboard" component={CompanionDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
