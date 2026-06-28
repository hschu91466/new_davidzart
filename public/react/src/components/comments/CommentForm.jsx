import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL, CDN_BASE } from "../../config";

const CommentForm = ({ contentId, onSuccess }) => {
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
          setFirstName("");
          setLastName("");
          setEmail("");
        }
        setComment("");

        if (onSuccess) {
          onSuccess();
        }
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
    <form
      className="comment-form"
      onSubmit={handleSubmit}
      aria-label="Add comment"
    >
      <h3>Add Comment</h3>

      {!user && (
        <fieldset>
          <legend>Your Information</legend>
          <div className="form-row form-row--two">
            <div>
              <label htmlFor="first_name">First Name</label>
              <input
                className="form-control"
                type="text"
                placeholder="First name"
                id="first_name"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="last_name">Last Name</label>
              <input
                className="form-control"
                type="text"
                placeholder="Last name"
                id="last_name"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                className="form-control"
                type="email"
                placeholder="Email"
                id="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
              />
            </div>
          </div>
        </fieldset>
      )}

      {user && (
        <p role="status">
          Posting as: <strong>{user.name}</strong>
        </p>
      )}

      <div className="form-row">
        <label htmlFor="comment-body">Your Comment</label>
        <textarea
          className="form-control"
          placeholder="Your comment..."
          id="comment-body"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          aria-required="true"
        />
      </div>

      <button
        className="btn btn-submit"
        type="submit"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {message && (
        <p role="status" aria-live="polite" aria-atomic="true">
          {message}
        </p>
      )}
    </form>
  );
};

export default CommentForm;
