import { BASE_URL, CDN_BASE } from "../../config";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import BannerQuote from "../home/BannerQuote";

// Header.jsx
const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="brand-band">
      <div className="banner-inner">
        <div className="banner-logo">
          <img src={`${CDN_BASE}/site-images/logo.png`} alt="David Z Art" />
        </div>

        <div className="banner-quote">
          <BannerQuote />
        </div>

        <div className="auth-controls">
          {user ? (
            <>
              <span className="auth-user">Welcome, {user.name}</span>
              <button className="auth-link" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="auth-link" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
