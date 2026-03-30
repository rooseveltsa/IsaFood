
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";

// Public pages
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import About from "./pages/About";
import HowItWorksPage from "./pages/HowItWorks";
import DeliveryPolicy from "./pages/DeliveryPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Admin (lazy loaded for code splitting)
import { AdminAuthGuard } from "./components/admin/AdminAuthGuard";
import { AdminLayout } from "./components/admin/AdminLayout";
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Kanban = lazy(() => import("./pages/admin/Kanban"));
const ShoppingList = lazy(() => import("./pages/admin/ShoppingList"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const CustomerDetail = lazy(() => import("./pages/admin/CustomerDetail"));
const WhatsAppPage = lazy(() => import("./pages/admin/WhatsApp"));
const CampaignsPage = lazy(() => import("./pages/admin/Campaigns"));

const AdminFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/como-funciona" element={<HowItWorksPage />} />
            <Route path="/politica-entrega" element={<DeliveryPolicy />} />
            <Route path="/termos" element={<Terms />} />

            {/* Admin login (public) */}
            <Route path="/admin/login" element={<Suspense fallback={<AdminFallback />}><AdminLogin /></Suspense>} />

            {/* Admin protected routes */}
            <Route path="/admin" element={<AdminAuthGuard />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Suspense fallback={<AdminFallback />}><Dashboard /></Suspense>} />
                <Route path="pedidos" element={<Suspense fallback={<AdminFallback />}><Orders /></Suspense>} />
                <Route path="kanban" element={<Suspense fallback={<AdminFallback />}><Kanban /></Suspense>} />
                <Route path="compras" element={<Suspense fallback={<AdminFallback />}><ShoppingList /></Suspense>} />
                <Route path="clientes" element={<Suspense fallback={<AdminFallback />}><Customers /></Suspense>} />
                <Route path="clientes/:id" element={<Suspense fallback={<AdminFallback />}><CustomerDetail /></Suspense>} />
                <Route path="whatsapp" element={<Suspense fallback={<AdminFallback />}><WhatsAppPage /></Suspense>} />
                <Route path="campanhas" element={<Suspense fallback={<AdminFallback />}><CampaignsPage /></Suspense>} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
