import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Earnings from "./pages/Earnings";
import Insights from "./pages/Insights";
import AIBuddy from "./pages/AIBuddy";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Marketplace from "./pages/Marketplace";

const queryClient = new QueryClient();

const RequireProfile = ({ children }: { children: JSX.Element }) => {
  const hasProfile = typeof window !== "undefined" && !!localStorage.getItem("creatorProfile");
  return hasProfile ? children : <Navigate to="/auth" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<RequireProfile><Index /></RequireProfile>} />
          <Route path="/earnings" element={<RequireProfile><Earnings /></RequireProfile>} />
          <Route path="/insights" element={<RequireProfile><Insights /></RequireProfile>} />
          <Route path="/ai-buddy" element={<RequireProfile><AIBuddy /></RequireProfile>} />
          <Route path="/goals" element={<RequireProfile><Goals /></RequireProfile>} />
          <Route path="/marketplace" element={<RequireProfile><Marketplace /></RequireProfile>} />
          <Route path="/settings" element={<RequireProfile><Settings /></RequireProfile>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
