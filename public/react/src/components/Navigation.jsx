import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <ul className="nav-list">
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
              to="/galleries"
              className={({ isActive }) =>
                "site-nav-link" + (isActive ? " is-active" : "")
              }
            >
              Galleries
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
