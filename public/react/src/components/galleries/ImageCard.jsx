const ImageCard = ({
  image,
  onChange,
  onMove,
  onSave,
  onDelete,
  savingId,
  movingImageId,
}) => {
  const isSaving = savingId === image.image_id;
  const isMoving = movingImageId === image.image_id;

  return (
    <div className="image-card">
      <img src={image.url} alt={image.title || "Image preview"} />

      <div className="form-group">
        <label htmlFor={`title-${image.image_id}`}>Title</label>
        <input
          id={`title-${image.image_id}`}
          type="text"
          value={image.title || ""}
          onChange={(e) => onChange(image.image_id, "title", e.target.value)}
          placeholder="Title"
        />

        <label htmlFor={`caption-${image.image_id}`}>Caption</label>
        <textarea
          id={`caption-${image.image_id}`}
          value={image.caption || ""}
          onChange={(e) => onChange(image.image_id, "caption", e.target.value)}
          placeholder="Caption"
        />

        <label htmlFor={`year-${image.image_id}`}>Year Created</label>
        <input
          id={`year-${image.image_id}`}
          type="text"
          value={image.year_created || ""}
          onChange={(e) =>
            onChange(image.image_id, "year_created", e.target.value)
          }
          placeholder="Year"
        />

        <label htmlFor={`medium-${image.image_id}`}>Medium</label>
        <input
          id={`medium-${image.image_id}`}
          type="text"
          value={image.medium || ""}
          onChange={(e) => onChange(image.image_id, "medium", e.target.value)}
          placeholder="Medium"
        />

        <label htmlFor={`dimensions-${image.image_id}`}>Dimensions</label>
        <input
          id={`dimensions-${image.image_id}`}
          type="text"
          value={image.dimensions || ""}
          onChange={(e) =>
            onChange(image.image_id, "dimensions", e.target.value)
          }
          placeholder="Dimensions"
        />

        <div className="form-actions">
          <button
            className="btn btn-approve btn-sm"
            onClick={() => onSave(image)}
            disabled={isSaving}
            aria-busy={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            className="btn btn-delete btn-sm delete-btn"
            onClick={() => onDelete(image.image_id)}
            aria-label="Delete image"
          >
            Delete
          </button>

          <div className="form-actions">
            <button
              className="btn btn-small"
              onClick={() => onMove(image.image_id, "up")}
              disabled={isMoving}
              aria-label="Move image up"
              aria-busy={isMoving}
            >
              ↑
            </button>

            <button
              className="btn btn-small"
              onClick={() => onMove(image.image_id, "down")}
              disabled={isMoving}
              aria-label="Move image down"
              aria-busy={isMoving}
            >
              ↓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
