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
//Auth pages
import RegistryConf from "./pages/auth/RegistryConfirmation";
import ChangePassword from "./pages/auth/ChangePassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
//Order pages
import OrderSuccess from "./shop/pages/OrderSuccess";
import { CartProvider } from "./shop/context/CartProvider";
import Cart from "./shop/pages/Cart";
import Orders from "./shop/pages/admin/Orders";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* SHOP: cart state for the whole app */}
        <CartProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/galleries" element={<Galleries />} />
              <Route path="/galleries/:slug" element={<GalleryDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* SHOP: public routes */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              {/* SHOP: --- */}
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
              {/* SHOP: admin route */}
              <Route path="orders" element={<Orders />} />
              {/* SHOP: --- */}
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
