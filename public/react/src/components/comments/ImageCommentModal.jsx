import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

const ImageCommentModal = ({ image, onClose, refreshKey, setRefreshKey }) => {
  if (!image) return null;

  const handleCommentSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close comments"
        >
          ×
        </button>

        {/* Image Tile */}
        <div className="modal-image-tile">
          <img src={image.image_url} alt={image.title || "Image preview"} />
          <div className="image-meta">
            <h2 id="modal-title">{image.title || "Untitled"}</h2>
            {image.caption && (
              <div className="image-caption">{image.caption}</div>
            )}
            {image.year_created && (
              <div className="image-year">{image.year_created}</div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div
          className="modal-comments"
          role="region"
          aria-label="Comments for this image"
        >
          <CommentList contentId={image.id} key={refreshKey} />
          <CommentForm contentId={image.id} onSuccess={handleCommentSuccess} />
        </div>
      </div>
    </div>
  );
};

export default ImageCommentModal;
