import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import InfoPage from "./pages/InfoPage";
import HidePage from "./pages/HidePage";
import RevealPage from "./pages/RevealPage";
import ScanPage from "./pages/ScanPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<InfoPage />} />
          <Route path="/hide" element={<HidePage />} />
          <Route path="/reveal" element={<RevealPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
