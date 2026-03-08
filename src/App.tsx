import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminGuard } from "@/components/admin/AdminGuard";
import Index from "./pages/Index";
import QuoteBuilder from "./pages/QuoteBuilder";
import QuoteHistory from "./pages/QuoteHistory";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreateQuote from "./pages/AdminCreateQuote";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/devis" element={<QuoteBuilder />} />
            <Route path="/mes-devis" element={<QuoteHistory />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin-dashboard"
              element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/create"
              element={
                <AdminGuard>
                  <AdminCreateQuote />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/edit/:id"
              element={
                <AdminGuard>
                  <AdminCreateQuote />
                </AdminGuard>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
