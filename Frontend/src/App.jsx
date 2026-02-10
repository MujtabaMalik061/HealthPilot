import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/style/Style.css";
import LandingLayout from "./layout/LandingLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LandingServices from "./components/Landing/LandingServices.jsx";
import LandingDoctors from "./components/Landing/LandingDoctors.jsx";
import LandingAbout from "./components/Landing/LandingAbout.jsx";
import LandingContact from "./components/Landing/LandingContact.jsx";
import LandingCareers from "./components/Landing/LandingCareers.jsx";
import LandingTerms from "./components/Landing/LandingTermsofService.jsx";
import LandingPrivacyPolicy from "./components/Landing/LandingPrivacyPolicy.jsx";
import SignIn from "./auth/SignIn.jsx";
import SignUp from "./auth/SignUp.jsx";
import AppLayout from "./layout/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { ProtectedRoute, PublicRoute } from "./routes/RouteGuards.jsx";
import NotFound from "./components/NotFound.jsx";
import AdminDoctors from "./pages/AdminDoctors.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminAppointments from "./pages/AdminAppointments.jsx";
import AdminServices from "./pages/AdminServices.jsx";
import AdminReports from "./pages/AdminReports.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/signIn"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/signUp"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        <Route element={<AppLayout />}>
          {/* ===== Admin ===== */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute role={["admin"]}>
                <AdminDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute role={["admin"]}>
                <AdminAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute role={["admin"]}>
                <AdminServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute role={["admin"]}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          {/* ===== Doctor ===== */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute role={["doctor"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute role={["doctor"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/info"
            element={
              <ProtectedRoute role={["doctor"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* ===== User ===== */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role={["patient"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute role={["patient"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute role={["patient"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute role={["patient"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* ===== All ===== */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute role={["doctor", "patient"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute role={["admin", "doctor", "patient"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing-services" element={<LandingServices />} />
          <Route path="/landing-doctors" element={<LandingDoctors />} />
          <Route path="/about" element={<LandingAbout />} />
          <Route path="/contact" element={<LandingContact />} />
          <Route path="/careers" element={<LandingCareers />} />
          <Route path="/privacy" element={<LandingPrivacyPolicy />} />
          <Route path="/terms" element={<LandingTerms />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/404" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
