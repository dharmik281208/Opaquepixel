import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import InfoPage from "./pages/InfoPage";
import HidePage from "./pages/HidePage";
import RevealPage from "./pages/RevealPage";
import ScanPage from "./pages/ScanPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ContactPage from "./pages/ContactPage";
import { isAuthenticated } from "./utils/auth";

function HomeRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/hide" replace />;
  }
  return <InfoPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomeRoute />} />
          <Route
            path="/hide"
            element={
              <ProtectedRoute>
                <HidePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reveal"
            element={
              <ProtectedRoute>
                <RevealPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                <ScanPage />
              </ProtectedRoute>
            }
          />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
