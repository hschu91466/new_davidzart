import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navigation = () => {
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="nav-inner">
        <button
          className="nav-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="nav-list"
        >
          ☰
        </button>
        <ul className={`nav-list ${menuOpen ? "open" : ""}`} id="nav-list">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                "site-nav-link" + (isActive ? " is-active" : "")
              }
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
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
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
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
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
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
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
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
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                Admin
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
