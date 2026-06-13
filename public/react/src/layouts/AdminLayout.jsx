import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Admin</h3>

        <nav className="admin-nav">
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
          </ul>
        </nav>
        <div className="button-group">
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/home")}>
            {" "}
            Go Home
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
