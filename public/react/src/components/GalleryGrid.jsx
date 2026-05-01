import GalleryCard from "./GalleryCard";

function GalleryGrid({ galleries, onSelect }) {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {galleries.map((gallery) => (
        <GalleryCard
          key={gallery.id}
          gallery={gallery}
          onClick={() => onSelect(gallery.slug)}
        />
      ))}
    </ul>
  );
}

export default GalleryGrid;
