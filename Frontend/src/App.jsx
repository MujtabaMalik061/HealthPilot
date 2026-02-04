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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
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
      </Routes>
    </>
  );
};

export default App;
