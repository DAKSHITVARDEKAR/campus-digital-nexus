
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Elections from "./pages/Elections";
import Budget from "./pages/Budget";
import Facilities from "./pages/Facilities";
import BookFacilityPage from "./pages/BookFacilityPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import Complaints from "./pages/Complaints";
import Applications from "./pages/Applications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/elections" element={<Elections />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/facilities/book/:facilityId" element={<BookFacilityPage />} />
          <Route path="/facilities/my-bookings" element={<MyBookingsPage />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/applications" element={<Applications />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
