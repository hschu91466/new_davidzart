import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { approveComment } from "../../services/comments";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          "/api/comments/admin-list.php?status=pending",
        );
        console.log("Comments response FULL:", res.data);
        setComments(res.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

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
    <div>
      <h2>Comments</h2>

      {comments.length === 0 ? (
        <p>No comments found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Author</th>
              <th>Comment</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {comments.map((comment) => (
              <tr key={comment.comment_id}>
                <td>{comment.comment_id}</td>

                <td>{comment.name}</td>

                <td>{comment.body}</td>

                <td>{comment.content_id}</td>

                <td>
                  <button onClick={() => handleApprove(comment.comment_id)}>
                    Approve
                  </button>

                  <button onClick={() => handleSpam(comment.comment_id)}>
                    Spam
                  </button>

                  <button onClick={() => handleDelete(comment.comment_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Comments;
