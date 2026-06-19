import GalleryCard from "./GalleryCard";

function GalleryGrid({ galleries, onSelect }) {
  return (
    <div id="galleriesGrid">
      {galleries.map((gallery) => (
        <GalleryCard
          key={gallery.slug}
          gallery={gallery}
          onClick={() => onSelect(gallery.slug)}
        />
      ))}
    </div>
  );
}

export default GalleryGrid;
