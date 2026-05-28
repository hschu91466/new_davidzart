import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
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
