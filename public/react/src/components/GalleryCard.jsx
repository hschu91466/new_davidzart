import BASE_URL from "../config";

function GalleryCard({ gallery, onClick }) {
  const imagePath = gallery.cover_image?.file_path || gallery.cover_url || null;

  const imageSrc = imagePath ? `${BASE_URL}${imagePath}` : null;

  return (
    <li className="gallery-card" onClick={onClick}>
      {imageSrc && (
        <img
          src={imageSrc}
          alt={gallery.title}
          className="gallery-card__image"
        />
      )}

      <strong>{gallery.title}</strong>
    </li>
  );
}

export default GalleryCard;
