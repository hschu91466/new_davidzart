import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function Navigation() {
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <ul className={`nav-list ${menuOpen ? "open" : ""}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                "site-nav-link" + (isActive ? " is-active" : "")
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                "site-nav-link" + (isActive ? " is-active" : "")
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                "site-nav-link" + (isActive ? " is-active" : "")
              }
            >
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/galleries"
              className={({ isActive }) =>
                "site-nav-link" + (isActive ? " is-active" : "")
              }
            >
              Galleries
            </NavLink>
          </li>
          {user?.role === "admin" && (
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  "site-nav-link admin-link" + (isActive ? " is-active" : "")
                }
              >
                Admin
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
