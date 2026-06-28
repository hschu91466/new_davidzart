import CommentList from "../comments/CommentList";
import CommentForm from "../comments/CommentForm";
import BASE_URL from "../../config";

const Lightbox = ({
  images,
  currentIndex,
  setCurrentIndex,
  onClose,
  refreshKey,
  setRefreshKey,
}) => {
  if (currentIndex === null || !images) return null;

  const currentImage = images[currentIndex];

  const imagePath = currentImage.file_path || currentImage.url || "";
  const lightboxSrc = `${BASE_URL}${imagePath}`;

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="lightbox-close"
          onClick={onClose}
          aria-label="Close image viewer"
        >
          ×
        </button>

        <button
          className="lightbox-prev"
          onClick={() =>
            setCurrentIndex((currentIndex - 1 + images.length) % images.length)
          }
          aria-label="Previous image"
        >
          ‹
        </button>

        <div className="lightbox-body">
          <div className="lightbox-image">
            <img
              src={lightboxSrc}
              alt={currentImage.title || "Gallery image"}
            />
          </div>

          <div className="lightbox-comments">
            <CommentList contentId={currentImage.id} key={refreshKey} />

            <CommentForm
              contentId={currentImage.id}
              onSuccess={() => setRefreshKey((k) => k + 1)}
            />
          </div>
        </div>

        <button
          className="lightbox-next"
          onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
          aria-label="Next image"
        >
          ›
        </button>

        <div className="lightbox-footer">
          <div className="lightbox-meta">
            {currentImage.title}
            {currentImage.year_created ? ` (${currentImage.year_created})` : ""}
            {currentImage.media ? `, ${currentImage.media}` : ""}
            {currentImage.dimensions ? `, ${currentImage.dimensions}` : ""}
          </div>

          <div className="lightbox-counter" aria-live="polite">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
