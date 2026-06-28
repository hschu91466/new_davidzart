import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL, CDN_BASE } from "../../config";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setForm({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        });
        navigate("/registryconfirmation", {
          state: { message: "Account created. Awaiting approval." },
        });
      } else {
        if (data.errors) {
          setMessage(data.errors.join(", "));
        } else {
          setMessage(data.error || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage("Something went wrong");
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
          <input
            id="reg-password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Creating..." : "Register"}
        </button>

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
