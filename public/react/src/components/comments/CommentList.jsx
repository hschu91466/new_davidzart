import React, { useEffect, useState } from "react";
import { BASE_URL, CDN_BASE } from "../../config";

const CommentList = ({ contentId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contentId) return;

    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/api/comments/list.php?content_id=${contentId}`,
        );

        const data = await response.json();

        if (data.ok) {
          setComments(data.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [contentId]);

  if (loading) {
    return (
      <p role="status" aria-live="polite">
        Loading comments…
      </p>
    );
  }

  return (
    <div role="region" aria-label="Comments">
      {comments.length === 0 ? (
        <p role="status">No comments yet</p>
      ) : (
        <ol className="comment-list">
          {comments.map((comment) => (
            <li key={comment.comment_id} className="comment">
              <div className="comment-header">
                <strong>{comment.name}</strong>
                <div>
                  <span className="comment-date" aria-label="Posted on">
                    {new Date(comment.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>
              <p>{comment.body}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default CommentList;
