import BASE_URL from "../config";

function GalleryCard({ gallery, onClick }) {
  const imagePath = gallery.cover_image?.file_path || gallery.cover_url || null;

  const imageSrc = imagePath ? `${BASE_URL}${imagePath}` : null;

  return (
    <li
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={gallery.title}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
      )}

      <strong>{gallery.title}</strong>
    </li>
  );
}

export default GalleryCard;
