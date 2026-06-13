import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL, CDN_BASE } from "../../config";

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
        setMessage(
          data.message ||
            (user
              ? "Comment posted successfully."
              : "Comment submitted for approval."),
        );

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
    <form className="comment-form" onSubmit={handleSubmit}>
      <h4>Add Comment</h4>

      {!user && (
        <div className="form-row form-row--two">
          <input
            className="form-control"
            type="text"
            placeholder="First name"
            id="first_name"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <input
            className="form-control"
            type="text"
            placeholder="Last name"
            id="last_name"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <input
            className="form-control"
            type="email"
            placeholder="Email"
            id="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      )}

      {user && (
        <p>
          Posting as: <strong>{user.name}</strong>
        </p>
      )}

      <div className="form-row">
        <textarea
          className="form-control"
          placeholder="Your comment..."
          id="place-holder"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      <button className="btn btn-submit" type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default CommentForm;
