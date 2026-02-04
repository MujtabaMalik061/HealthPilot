import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <Toaster
          richColors
          position="bottom-right"
          // closeButton
          dismissible
          toastOptions={{
            duration: 4000,
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
