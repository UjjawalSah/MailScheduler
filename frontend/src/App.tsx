import { Toaster } from "@/components-dashboard/ui/toaster";
import { Toaster as Sonner } from "@/components-dashboard/ui/sonner";
import { TooltipProvider } from "@/components-dashboard/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "@/components-dashboard/Header";
import Sidebar from "@/components-dashboard/Sidebar";
import DashboardLayout from "@/components-dashboard/DashboardLayout";

import Index from "./pages/Index";
import IndexDashboard from "./pages/index-dashboard";
import BusinessTemplates from "./pages/BusinessTemplates";
import MarketingTemplates from "./pages/MarketingTemplates";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { Joystick } from "lucide-react";
import JobApplicationTemplates from "./pages/JobApplicationTemplates";

// 🔹 Dashboard Layout Wrapper (Sidebar + Header)
const DashboardWrapper = ({ children }) => (
  <div className="min-h-screen flex">
    <Sidebar /> {/* ✅ Sidebar Always Visible */}
    <div className="flex-1">
      <Header />
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ✅ Public Page (No Sidebar) */}
          <Route path="/" element={<Index />} />

          {/* ✅ Dashboard Pages (With Sidebar & Header) */}
          <Route path="/dashboard" element={<DashboardWrapper><IndexDashboard /></DashboardWrapper>} />
          <Route path="/profile" element={<DashboardWrapper><Profile /></DashboardWrapper>} />
          <Route path="/templates/job-applications" element={<DashboardWrapper><JobApplicationTemplates /></DashboardWrapper>} />
  
          <Route path="/templates/business" element={<DashboardWrapper><BusinessTemplates /></DashboardWrapper>} />
          <Route path="/templates/marketing" element={<DashboardWrapper><MarketingTemplates /></DashboardWrapper>} />
          <Route path="/analytics" element={<DashboardWrapper><Analytics /></DashboardWrapper>} />
          <Route path="/settings" element={<DashboardWrapper><Settings /></DashboardWrapper>} />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
