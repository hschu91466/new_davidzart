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
        // ✅ clear form
        setForm({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        });
        navigate("/registryconfirmation", {
          state: { message: "Account created.  Awaiting approval." },
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
    <div className="auth-container container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h3>Create Account</h3>

        <input
          type="text"
          name="first_name"
          placeholder="First name"
          value={form.first_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last name"
          value={form.last_name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        {message && <p>{message}</p>}

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
