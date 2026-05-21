import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import DashboardLayout from "../components/layout/DashboardLayout";

// Public Pages
import LandingPage from "../features/landing/screen/LandingPage";
import LoginPage from "../features/auth/page/LoginPage";

// Admin / Core Pages
import DashboardPage from "../features/dashboard/DashboardPage/DashboardPage";
import UsersPage from "../features/users/pages/UserPage";
import ProductPage from "../features/products/pages/ProductPage";
import SettingsPage from "../features/settings/pages/SettingsPage";

// Analytics & Recommendations
import RecommendationPage from "../features/recommendations/page/RecommendationPage";
import SkinConditionPage from "../features/condition/page/SkinConditionPage";
import ReportPage from "../features/reports/page/ReportPage";

// Scans
import UserScanPage from "../features/scan/screen/UserScanPage";


// Lifestyle (New Feature)
import LifestylePage from "../features/lifestyle/page/LifestylePage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* --- Admin Protected Routes --- */}
        <Route path="/admin" element={<DashboardLayout />}>
          {/* Default Redirect: /admin -> /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Core Management */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Clinical & Analysis */}
          <Route path="recommendation" element={<RecommendationPage />} />
          <Route path="condition" element={<SkinConditionPage />} />
          <Route path="report" element={<ReportPage />} />

          {/* Scan Feature Set */}
          <Route path="users-scan" element={<UserScanPage />} />

          {/* Lifestyle Feature Set */}
          <Route path="lifestyle" element={<LifestylePage />} />
        </Route>

        {/* --- Global Fallback --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}