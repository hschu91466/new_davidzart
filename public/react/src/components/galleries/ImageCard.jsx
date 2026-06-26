const ImageCard = ({
  image,
  onChange,
  onMove,
  onSave,
  onDelete,
  savingId,
  movingImageId,
}) => {
  return (
    <div className="image-card">
      <img src={image.url} alt="" />

      <div className="form-group">
        <input
          type="text"
          value={image.title || ""}
          onChange={(e) => onChange(image.image_id, "title", e.target.value)}
          placeholder="Title"
        />

        <textarea
          value={image.caption || ""}
          onChange={(e) => onChange(image.image_id, "caption", e.target.value)}
          placeholder="Caption"
        />

        <input
          type="text"
          value={image.year_created || ""}
          onChange={(e) =>
            onChange(image.image_id, "year_created", e.target.value)
          }
          placeholder="Year"
        />

        <input
          type="text"
          value={image.medium || ""}
          onChange={(e) => onChange(image.image_id, "medium", e.target.value)}
          placeholder="Medium"
        />

        <input
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
            disabled={savingId === image.image_id}
          >
            {savingId === image.image_id ? "Saving..." : "Save"}
          </button>

          <button
            className="btn btn-delete btn-sm delete-btn"
            onClick={() => onDelete(image.image_id)}
          >
            Delete
          </button>

          <div className="form-actions">
            <button
              className="btn btn-small"
              onClick={() => onMove(image.image_id, "up")}
              disabled={movingImageId === image.image_id}
            >
              ↑
            </button>

            <button
              className="btn btn-small"
              onClick={() => onMove(image.image_id, "down")}
              disabled={movingImageId === image.image_id}
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
