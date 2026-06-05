import BASE_URL from "../config";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

// Header.jsx
const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="brand-band">
      <div className="site-banner">
        <div className="banner-inner">
          <div className="banner-logo">
            <img
              src={`${BASE_URL}/assets/images/site-images/logo.png`}
              alt="David Z Art"
            />
          </div>

          <div className="banner-scripture">
            <span>
              “ Let all that I am praise the Lord; with my whole heart, I will
              praise His holy name. Psalm 103:1 ”
            </span>
            <div className="auth-controls">
              {user ? (
                <>
                  <span className="auth-user">Welcome, {user.name}</span>

                  <button className="auth-logout" onClick={logout}>
                    Logout
                  </button>
                </>
              ) : (
                <Link className="auth-login" to="/login">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
