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
import DoctorDashboard from "./pages/Doctor/DashBoard.jsx";
import { ProtectedRoute, PublicRoute } from "./routes/RouteGuards.jsx";
import NotFound from "./components/NotFound.jsx";
import AdminDoctors from "./pages/AdminDoctors.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminAppointments from "./pages/AdminAppointments.jsx";
import AdminServices from "./pages/AdminServices.jsx";
import AdminReports from "./pages/AdminReports.jsx";
import DoctorInfo from "./pages/Doctor/DoctorInfo.jsx";
import Setting from "./pages/Setting.jsx";
import AdminDoctorDetails from "./components/Admin_DetailsPages/DoctorDetails.jsx";
import AdminUserDetails from "./components/Admin_DetailsPages/UserDetails.jsx";
import DoctorDetails from "./components/DetailsPages/DoctorDetails.jsx";
import UserDetails from "./components/DetailsPages/UserDetails.jsx";
import ServiceDetails from "./components/DetailsPages/ServiceDetails.jsx";
import AppointmentBooking from "./pages/Paitent/AppointmentBooking.jsx";
import UserDoctors from "./pages/Paitent/Doctors.jsx";
import UserServices from "./pages/Paitent/Services.jsx";
import PaitentAppointments from "./pages/Paitent/Appointments.jsx";
import DoctorAppointments from "./pages/Doctor/Appointments.jsx";
import AppointmentDetails from "./components/DetailsPages/AppointmentDetails.jsx";
import Reports from "./pages/Doctor/Reports.jsx";

import { ChatBot, ThemeProvider } from "local-chatbot";
import "local-chatbot/style.css";
import { store, theme } from "./utils/Helper.js";

const App = () => {
  return (
    <>
      <ThemeProvider>
        <ChatBot store={store} theme={theme} botPosition="bottomRight" />
      </ThemeProvider>
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
            path="/admin/doctor-details/:doctorId"
            element={
              <ProtectedRoute role={["admin"]}>
                <AdminDoctorDetails />
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
            path="/admin/user-details/:userId"
            element={
              <ProtectedRoute role={["admin"]}>
                <AdminUserDetails />
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
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute role={["doctor"]}>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/info"
            element={
              <ProtectedRoute role={["doctor"]}>
                <DoctorInfo />
              </ProtectedRoute>
            }
          />
          {/* ===== User ===== */}
          <Route
            path="/doctors"
            element={
              <ProtectedRoute role={["patient"]}>
                <UserDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appoint-booking/:doctorId"
            element={
              <ProtectedRoute role={["patient"]}>
                <AppointmentBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute role={["patient"]}>
                <UserServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute role={["patient"]}>
                <PaitentAppointments />
              </ProtectedRoute>
            }
          />
          {/* ===== All ===== */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute role={["doctor", "patient"]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-details/:serviceId"
            element={
              <ProtectedRoute role={["admin", "patient"]}>
                <ServiceDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointment-details/:appointmentId"
            element={
              <ProtectedRoute role={["admin", "doctor", "patient"]}>
                <AppointmentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-details/:doctorId"
            element={
              <ProtectedRoute role={["doctor", "patient"]}>
                <DoctorDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-details/:userId"
            element={
              <ProtectedRoute role={["doctor", "patient"]}>
                <UserDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute role={["admin", "doctor", "patient"]}>
                <Setting />
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
