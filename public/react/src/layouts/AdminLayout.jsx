import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);

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
                Galleries
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/comments"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Comments
              </NavLink>
            </li>
          </ul>
        </nav>
        <button onClick={logout}>Logout</button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
