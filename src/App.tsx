
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Elections from "./pages/Elections";
import ElectionDetailsPage from "./pages/ElectionDetailsPage";
import Budget from "./pages/Budget";
import Facilities from "./pages/Facilities";
import BookFacilityPage from "./pages/BookFacilityPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import Complaints from "./pages/Complaints";
import Applications from "./pages/Applications";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/SettingsPage";
import BoardReviewPage from "./pages/BoardReviewPage";
import ProfilePage from "./pages/ProfilePage";
import AchievementsPage from "./pages/AchievementsPage";
import CheatingRecordsPage from "./pages/CheatingRecordsPage";
import NotificationsPage from "./pages/NotificationsPage";

// Dashboards
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<Index />} />
          
          {/* Role-specific dashboards */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          
          <Route path="/elections" element={<Elections />} />
          <Route path="/elections/:electionId" element={<ElectionDetailsPage />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/facilities/book/:facilityId" element={<BookFacilityPage />} />
          <Route path="/facilities/my-bookings" element={<MyBookingsPage />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          
          {/* New routes */}
          <Route path="/cheating-records" element={<CheatingRecordsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          
          {/* Faculty specific routes */}
          <Route path="/faculty/board-review" element={<BoardReviewPage />} />
          
          {/* 404 page */}
          <Route path="/not-found" element={<NotFound />} />
          
          {/* Redirect to home instead of showing 404 page */}
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
