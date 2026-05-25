import BASE_URL from "../config";

function GalleryCard({ gallery, onClick }) {
  const imagePath = gallery.cover_image?.file_path || gallery.cover_url || null;

  const imageSrc = imagePath ? `${BASE_URL}${imagePath}` : null;

  return (
    <div className="gallery-item" onClick={onClick}>
      <div className="gallery-card">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={gallery.title}
            className="gallery-card__image"
          />
        )}
      </div>

      <div className="gallery-title">{gallery.title}</div>
    </div>
  );
}

export default GalleryCard;
