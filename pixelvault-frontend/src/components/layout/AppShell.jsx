import { Outlet } from "react-router-dom";
import AmbientBackground from "../AmbientBackground";
import CursorGlow from "../CursorGlow";
import Header from "./Header";
import Footer from "./Footer";

export default function AppShell() {
  return (
    <>
      <AmbientBackground />
      <CursorGlow />
      <div className="relative z-[1] min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 site-main">
          <div className="site-container">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
