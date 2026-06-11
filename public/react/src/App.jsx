import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Galleries from "./pages/Galleries";
import GalleryDetail from "./pages/GalleryDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminGalleries from "./pages/admin/Galleries";
import AdminComments from "./pages/admin/Comments";
import Dashboard from "./pages/admin/Dashboard";
// import AdminLogin from "../../../@DO NOT INCLUDE/AdminLogin";
import AdminUsers from "./pages/admin/Users";
import RegistryConf from "./pages/auth/RegistryConfirmation";
import Login from "./pages/auth/Login";
import { AuthProvider } from "./context/AuthProvider";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/galleries" element={<Galleries />} />
            <Route path="/galleries/:slug" element={<GalleryDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registryconfirmation" element={<RegistryConf />} />
          </Route>

          {/* <Route path="/admin/login" element={<AdminLogin />} /> */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="galleries" element={<AdminGalleries />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
