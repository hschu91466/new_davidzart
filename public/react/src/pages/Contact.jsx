import CommentList from "../components/comments/CommentList";
import { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus("Please fill out all fields");
      return;
    }

    try {
      setStatus("Sending...");

      await axios.post("/api/contact/send.php", form);

      setTimeout(() => {
        setStatus("Message Sent");
        setForm({
          name: "",
          email: "",
          message: "",
        });
      }, 1000);
    } catch (error) {
      console.error(error);

      setStatus(error.response?.data?.message || "Failed to send ❌");
    }
  };

  return (
    <div>
      <div className="form-container">
        <h2>Contact</h2>
        <p>
          Feel free to reach out with questions, comments, or inquiries about
          artwork.
        </p>

        <form onSubmit={handleSubmit} className="form-group">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
            />
          </div>
<div className="form-group">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
          />
</div>
<div className="form-group">
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="4"
          />
</div>
          <button
            disabled={status === "Sending..."}
            className="btn btn-primary"
          >
            {status === "Sending..." ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status && <div>{status}</div>}
      </div>
    </div>
  );
};

export default Contact;
