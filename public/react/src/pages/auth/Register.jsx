import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";

const Register = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    setError("");

    if (!form.first_name.trim()) {
      setError("First name is required");
      return false;
    }

    if (!form.last_name.trim()) {
      setError("Last name is required");
      return false;
    }

    if (!form.email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!form.password) {
      setError("Password is required");
      return false;
    }

    if (!form.confirmPassword) {
      setError("Please confirm your password");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setForm({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/registryconfirmation", {
          state: { message: "Account created. Awaiting approval." },
        });
      } else {
        if (data.errors) {
          setError(data.errors.join(", "));
        } else {
          setError(data.error || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Register error:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form
        onSubmit={handleSubmit}
        className="form-group"
        aria-label="Registration form"
      >
        <h1>Create Account</h1>

        <div className="form-group">
          <label htmlFor="first_name">First Name:</label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Last Name:</label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Email:</label>
          <input
            id="reg-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password:</label>
          <div className="password-input-wrapper">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              aria-required="true"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="reg-confirm-password">Confirm Password:</label>
          <div className="password-input-wrapper">
            <input
              id="reg-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              aria-required="true"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        {error && (
          <p
            className="form-message form-message--error"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            className="form-message form-message--success"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            {message}
          </p>
        )}

        <p>
          Already have an account?{" "}
          <Link to="/login" className="auth-register">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
