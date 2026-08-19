import { Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle admin menu"
          aria-expanded={sidebarOpen}
        >
          ☰
        </button>

        <div className="admin-topbar-actions">
          <button className="btn btn-primary btn-sm" onClick={handleLogout}>
            Logout
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/home")}
          >
            Go Home
          </button>
        </div>
      </header>

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <h3>Admin</h3>

        <nav className="admin-nav" onClick={() => setSidebarOpen(false)}>
          <ul>
            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/galleries"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Manage Galleries
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/comments"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Moderate Comments
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/messages"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Manage Messages
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/quotes"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Manage Quotes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/admin-checklist"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Admin Checklist
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/public-review"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Public Review
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
