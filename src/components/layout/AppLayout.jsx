import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTop from "../ui/BackToTop";
import { ThemeProvider } from "../../context/ThemeContext";

export default function AppLayout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--bg-primary)" }}>
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </ThemeProvider>
  );
}