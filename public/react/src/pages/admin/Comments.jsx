import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { approveComment } from "../../services/comments";
import "../../styles/features/admin-comments.css";

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
    return <div>Loading comments...</div>;
  }

  return (
    <div className="comments-page">
      <h2>Comments</h2>
      <div className="comments-tabs" style={{ marginBottom: "1rem" }}>
        <button onClick={() => setStatus("pending")}>Pending</button>
        <button onClick={() => setStatus("approved")}>Approved</button>
        <button onClick={() => setStatus("spam")}>Spam</button>
      </div>

      {comments.length === 0 ? (
        <p>No comments found.</p>
      ) : (
        <table
          className="comments-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Status</th>
              <th>ID</th>
              <th>Author</th>
              <th>Comment</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {comments.map((comment) => {
              const isApproved = Number(comment.is_approved) === 1;
              const isSpam = Number(comment.is_spam) === 1;

              return (
                <tr key={comment.comment_id}>
                  {/* ✅ STATUS FIRST (matches header) */}
                  <td>
                    <span
                      className={`status-badge ${
                        isSpam ? "spam" : isApproved ? "approved" : "pending"
                      }`}
                    >
                      {isSpam ? "Spam" : isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  {/* ✅ THEN THE REST */}
                  <td>{comment.comment_id}</td>
                  <td>{comment.name}</td>
                  <td>{comment.body}</td>

                  <td>
                    <strong>{comment.title || "Untitled Image"}</strong>
                    <br />
                    <small>ID: {comment.content_id}</small>
                  </td>

                  <td className="comment-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(comment.comment_id)}
                    >
                      Approve
                    </button>

                    <button
                      className="btn-spam"
                      onClick={() => handleSpam(comment.comment_id)}
                    >
                      Spam
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(comment.comment_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Comments;
