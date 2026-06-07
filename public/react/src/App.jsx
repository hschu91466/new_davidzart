import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Galleries from "./pages/Galleries";
import GalleryDetail from "./pages/GalleryDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./components/auth/Login";
import AdminLogin from "./pages/admin/Login";
import { AuthProvider } from "./context/AuthProvider";
import Register from "./components/auth/Register";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminGalleries from "./pages/admin/Galleries";
import AdminComments from "./pages/admin/Comments";

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
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/admin/galleries" element={<AdminGalleries />} />
            <Route path="/admin/comments" element={<AdminComments />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
