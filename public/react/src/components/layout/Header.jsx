import { BASE_URL, CDN_BASE } from "../../config";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import BannerQuote from "../quotes/BannerQuote";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="brand-band">
      <div className="banner-inner">
        <div className="banner-logo">
          <Link to="/" aria-label="Home">
            <img
              src={`${CDN_BASE}/site-images/logo.png`}
              alt="David Z Art logo"
            />
          </Link>
        </div>

        <div className="banner-quote">
          <BannerQuote />
        </div>

        <div className="auth-controls">
          {user ? (
            <div className="user-menu">
              <button
                className="user-menu-toggle"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User menu"
                aria-expanded={userMenuOpen}
                aria-controls="user-dropdown"
              >
                Welcome, {user.name} ▼
              </button>

              {userMenuOpen && (
                <div className="user-dropdown" id="user-dropdown">
                  <Link
                    to="/change-password"
                    className="dropdown-link"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Change Password
                  </Link>
                  <button
                    className="dropdown-link dropdown-logout"
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    aria-label="Logout from account"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              className="auth-link"
              to="/login"
              aria-label="Login to your account"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
