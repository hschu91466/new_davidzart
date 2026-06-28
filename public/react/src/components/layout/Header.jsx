import { BASE_URL, CDN_BASE } from "../../config";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import BannerQuote from "../home/BannerQuote";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

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
            <>
              <span className="auth-user" role="status">
                Welcome, {user.name}
              </span>
              <button
                className="auth-link"
                onClick={logout}
                aria-label="Logout from account"
              >
                Logout
              </button>
            </>
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
