import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { approveComment } from "../../services/comments";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `/api/comments/admin-list.php?status=${status}`,
        );
        console.log("Comments response FULL:", res.data);
        if (res.data.ok) {
          setComments(res.data.comments);
        } else {
          console.error("API error:", res.data.error);
          setComments([]);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [status]);

  const handleApprove = async (id) => {
    try {
      const res = await approveComment(id);
      if (res.data.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment.comment_id !== id),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const res = await axios.post("/api/comments/delete.php", {
        comment_id: id,
      });

      if (res.data.ok) {
        setComments((prev) => prev.filter((c) => c.comment_id !== id));
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleSpam = async (id) => {
    try {
      const res = await axios.post("/api/comments/spam.php", {
        comment_id: id,
      });

      if (res.data.ok) {
        setComments((prev) => prev.filter((c) => c.comment_id !== id));
      }
    } catch (error) {
      console.error("Spam error:", error);
    }
  };

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        Loading comments...
      </div>
    );
  }

  return (
    <div className="comments-page">
      <h1>Moderate Comments</h1>
      <div
        className="button-group comments-tabs"
        style={{ marginBottom: "1rem" }}
        role="tablist"
        aria-label="Filter comments by status"
      >
        <button
          className={`btn btn-tab ${status === "pending" ? "btn-active" : "btn-tab"}`}
          onClick={() => setStatus("pending")}
          role="tab"
          aria-selected={status === "pending"}
          aria-controls="comments-table"
        >
          Pending
        </button>
        <button
          className={`btn btn-tab ${status === "approved" ? "btn-active" : "btn-tab"}`}
          onClick={() => setStatus("approved")}
          role="tab"
          aria-selected={status === "approved"}
          aria-controls="comments-table"
        >
          Approved
        </button>
        <button
          className={`btn btn-tab ${status === "spam" ? "btn-active" : "btn-tab"}`}
          onClick={() => setStatus("spam")}
          role="tab"
          aria-selected={status === "spam"}
          aria-controls="comments-table"
        >
          Spam
        </button>
      </div>

      {!comments || comments.length === 0 ? (
        <p role="status">No comments found.</p>
      ) : (
        <div className="table-wrapper">
          <table
            id="comments-table"
            className="table"
            style={{ width: "100%", borderCollapse: "collapse" }}
            aria-label="Comments for moderation"
          >
            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col">Author</th>
                <th scope="col">Comment</th>
                <th scope="col">Image</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {comments.map((comment) => {
                const isApproved = Number(comment.is_approved) === 1;
                const isSpam = Number(comment.is_spam) === 1;

                return (
                  <tr key={comment.comment_id}>
                    <td>
                      <span
                        className={`status-badge ${
                          isSpam ? "spam" : isApproved ? "approved" : "pending"
                        }`}
                      >
                        {isSpam ? "Spam" : isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>

                    <td>{comment.name}</td>
                    <td>{comment.body}</td>

                    <td>
                      <strong>{comment.title || "Untitled Image"}</strong>
                      <br />
                      <small>ID: {comment.content_id}</small>
                    </td>
                    <td>
                      {new Date(comment.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="comment-actions button-group">
                      <button
                        className="btn btn-approve btn-sm"
                        onClick={() => handleApprove(comment.comment_id)}
                        aria-label={`Approve comment by ${comment.name}`}
                      >
                        Approve
                      </button>

                      <button
                        className="btn btn-spam btn-sm"
                        onClick={() => handleSpam(comment.comment_id)}
                        aria-label={`Mark as spam: comment by ${comment.name}`}
                      >
                        Spam
                      </button>

                      <button
                        className="btn btn-delete btn-sm"
                        onClick={() => handleDelete(comment.comment_id)}
                        aria-label={`Delete comment by ${comment.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Comments;
