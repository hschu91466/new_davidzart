import ImageCard from "./ImageCard";

const ImageGrid = ({
  images,
  onChange,
  onSave,
  onDelete,
  onMove,
  savingId,
  movingImageId,
}) => {
  if (images.length === 0) {
    return <p>Select a gallery to view and manage its images.</p>;
  }

  return (
    <div className="image-grid">
      {images.map((img) => (
        <ImageCard
          key={img.image_id}
          image={img}
          onChange={onChange}
          onSave={onSave}
          onDelete={onDelete}
          onMove={onMove}
          savingId={savingId}
          movingImageId={movingImageId}
        />
      ))}
    </div>
  );
};

export default ImageGrid;
