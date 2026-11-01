import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Layouts
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";
// Pages
import Home from "./pages/Home";
import Galleries from "./pages/Galleries";
import GalleryDetail from "./pages/GalleryDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
//Admin pages
import AdminGalleries from "./pages/admin/Galleries";
import AdminComments from "./pages/admin/Comments";
import Dashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminMessages from "./pages/admin/Messages";
import AdminQuotes from "./pages/admin/Quotes";
import TestingChecklist from "./pages/admin/TestingChecklist";
import PublicSiteReview from "./pages/admin/PublicSiteReview";
import Orders from "./pages/admin/Orders";
//Auth pages
import RegistryConf from "./pages/auth/RegistryConfirmation";
import ChangePassword from "./pages/auth/ChangePassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
//Order pages
import OrderSuccess from "./pages/shop/OrderSuccess";
import { CartProvider } from "./context/CartProvider";
import Cart from "./pages/shop/Cart";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/galleries" element={<Galleries />} />
              <Route path="/galleries/:slug" element={<GalleryDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/registryconfirmation" element={<RegistryConf />} />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />
            </Route>

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
              <Route path="messages" element={<AdminMessages />} />
              <Route path="quotes" element={<AdminQuotes />} />
              <Route path="orders" element={<Orders />} />
              <Route
                path="/admin/admin-checklist"
                element={<TestingChecklist />}
              />
              <Route
                path="/admin/public-review"
                element={<PublicSiteReview />}
              />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
