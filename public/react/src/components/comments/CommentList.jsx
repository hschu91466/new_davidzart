import React, { useEffect, useState } from "react";
import BASE_URL from "../../config";

const CommentList = ({ contentId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!contentId) return;

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/comments/list.php?content_id=${contentId}`,
        );

        const data = await response.json();

        if (data.ok) {
          setComments(data.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [contentId]);

  return (
    <div>
      {/* <h6>Comments</h6> */}

      {comments.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.comment_id} className="comment">
            <div className="comment-header">
              <strong>{comment.name}</strong>
              <div>
                <span className="comment-date">
                  {new Date(comment.created_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>
            <p>{comment.body}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
