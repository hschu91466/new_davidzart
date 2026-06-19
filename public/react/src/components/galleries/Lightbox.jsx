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
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="lightbox-close" onClick={onClose}>
          x
        </button>

        {/* Left arrow */}
        <button
          className="lightbox-prev"
          onClick={() =>
            setCurrentIndex((currentIndex - 1 + images.length) % images.length)
          }
        >
          ‹
        </button>

        <div className="lightbox-body">
          <div className="lightbox-image">
            <img src={lightboxSrc} alt="" />
          </div>

          <div className="lightbox-comments">
            <CommentList contentId={currentImage.id} key={refreshKey} />

            <CommentForm
              contentId={currentImage.id}
              onSuccess={() => setRefreshKey((k) => k + 1)}
            />
          </div>
        </div>

        {/* Right arrow */}
        <button
          className="lightbox-next"
          onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
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

          <div className="lightbox-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
