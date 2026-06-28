const GalleryCard = ({ gallery, onClick, role }) => {
  const imageSrc = gallery.cover_image?.image_url || null;

  return (
    <button
      className="gallery-item"
      onClick={onClick}
      role={role || "button"}
      aria-label={`View ${gallery.title} gallery`}
    >
      <div className="gallery-card">
        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            className="gallery-card__image"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="gallery-title">{gallery.title}</div>
    </button>
  );
};

export default GalleryCard;
