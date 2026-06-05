import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import BASE_URL from "../../config";

const CommentForm = ({ contentId }) => {
  const { user } = useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_id: contentId,
          content_type: "image",
          name: user ? user.name : `${firstName} ${lastName}`.trim(),
          email: user ? user.email : email,
          body: comment,
        }),
      });

      const data = await response.json();
      console.log("CREATE RESPONSE:", data);

      if (response.ok) {
        setMessage(data.message || (
          user ? "Comment posted successfully." : "Comment submitted for approval."
        ));

        if (!user) {
          // clear form
          setFirstName("");
          setLastName("");
          setEmail("");
        }
        setComment("");
      } else {
        setMessage(data.error || "Error submitting comment.");
      }
    } catch (error) {
      console.error("Error submitting comment.", error);
      setMessage("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add Comment</h4>

      {!user && (
        <>
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </>
      )}

      {user && (
        <p>
          Posting as: <strong>{user.name}</strong>
        </p>
      )}

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
