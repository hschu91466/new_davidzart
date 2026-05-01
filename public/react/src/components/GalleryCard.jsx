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
          src={`http://localhost:81/sites/production/davidschu_new/public${gallery.cover_image.file_path}`}
          alt={gallery.title}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
      )}
      <strong>{gallery.title}</strong>
    </li>
  );
}

export default GalleryCard;
