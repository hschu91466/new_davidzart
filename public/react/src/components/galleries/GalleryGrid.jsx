import GalleryCard from "./GalleryCard";

const GalleryGrid = ({ galleries, onSelect, "aria-label": ariaLabel }) => {
  return (
    <div id="galleriesGrid" role="grid" aria-label={ariaLabel || "Galleries"}>
      {galleries.map((gallery) => (
        <GalleryCard
          key={gallery.slug}
          gallery={gallery}
          onClick={() => onSelect(gallery.slug)}
          role="gridcell"
        />
      ))}
    </div>
  );
};

export default GalleryGrid;
