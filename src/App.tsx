import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import Complaints from './pages/Complaints';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import CheatingRecordsPage from './pages/CheatingRecordsPage';
import BoardReviewPage from './pages/BoardReviewPage';
import Applications from './pages/Applications';
import Elections from './pages/Elections';
import ElectionDetailsPage from './pages/ElectionDetailsPage';
import Budget from './pages/Budget';
import { Toaster } from '@/components/ui/toaster';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import Facilities from './pages/Facilities';
import BookFacilityPage from './pages/BookFacilityPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AchievementsPage from './pages/AchievementsPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/cheating-records" element={<CheatingRecordsPage />} />
          <Route path="/elections" element={<Elections />} />
          <Route path="/elections/:electionId" element={<ElectionDetailsPage />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/achievements" element={<AchievementsPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/board-review" element={<BoardReviewPage />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/book-facility/:facilityId?" element={<BookFacilityPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Route>

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
