import { useState } from "react";

const BASE_URL = "http://localhost/sites/production/davidschu_new/public";

const CommentForm = ({ contentId, onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/api/comments/create.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_id: contentId,
          content_type: "image",
          name,
          email,
          comment,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setMessage("Comment submitted for approval.");

        // clear form
        setName("");
        setEmail("");
        setComment("");

        if (onSuccess) onSuccess();
      } else {
        setMessage("Error submitting comment.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add Comment</h4>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <textarea
        placeholder="Your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default CommentForm;
