import Header from "../components/layout/Header";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="app-container">
      <Header />
      <Navigation />

      <main className="app-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
