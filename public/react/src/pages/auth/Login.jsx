import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, CDN_BASE } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login.php`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (response.ok && !data.error) {
        setMessage("Login successful");
        setUser(data.user);
        navigate(location.state?.from || "/home");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container form-container--compact">
      <h1>Login</h1>

      <form onSubmit={handleSubmit} aria-label="Login form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            aria-required="true"
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            aria-required="true"
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <Link className="auth-register" to="/register">
          Create new account
        </Link>
      </form>

      {message && (
        <p role="status" aria-live="polite" style={{ color: "green" }}>
          {message}
        </p>
      )}
      {error && (
        <p
          id="login-error"
          role="alert"
          aria-live="assertive"
          style={{ color: "red" }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Login;
