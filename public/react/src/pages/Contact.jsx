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
        <h1>Contact</h1>
        <p>
          Feel free to reach out with questions, comments, or inquiries about
          artwork.
        </p>

        <form
          onSubmit={handleSubmit}
          className="form-group"
          aria-label="Contact form"
        >
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="4"
              required
              aria-required="true"
            />
          </div>
          <button
            disabled={status === "Sending..."}
            className="btn btn-primary"
            aria-busy={status === "Sending..."}
          >
            {status === "Sending..." ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status && (
          <div role="status" aria-live="polite" aria-atomic="true">
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
