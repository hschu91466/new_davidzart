function GalleryCard({ gallery, onClick }) {
  return (
    <li
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {gallery.cover_image && (
        <img
          src={gallery.cover_image.url}
          alt={gallery.title}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
      )}
      <strong>{gallery.title}</strong>
    </li>
  );
}

export default GalleryCard;
