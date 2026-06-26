const GallerySelector = ({
  galleries,
  selectedGalleryId,
  onSelect,
  onAdd,
  onEdit,
  onDeactivate,
  onMove,
  movingId,
}) => {
  const selectedIndex = galleries.findIndex(
    (g) => g.gallery_id === selectedGalleryId,
  );
  const selectedGallery = galleries[selectedIndex];
  const isMoving = movingId === selectedGalleryId;

  return (
    <div className="gallery-select-row">
      <select
        className="form-select"
        value={selectedGalleryId}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Select Gallery</option>
        {galleries.map((g) => (
          <option key={g.gallery_id} value={g.gallery_id}>
            {g.title}
          </option>
        ))}
      </select>
      <button className="btn btn-small" onClick={onAdd}>
        +
      </button>
      <button
        className="btn btn-small"
        onClick={() => onEdit(selectedGalleryId)}
      >
        Edit
      </button>
      <button
        className="btn btn-small"
        onClick={() => onDeactivate(selectedGalleryId)}
      >
        Delete
      </button>
      <button
        className="btn btn-small"
        onClick={() => onMove(selectedGalleryId, "up")}
        disabled={!selectedGalleryId || movingId === selectedGalleryId}
      >
        ↑
      </button>
      <button
        className="btn btn-small"
        onClick={() => onMove(selectedGalleryId, "down")}
        disabled={!selectedGalleryId || movingId === selectedGalleryId}
      >
        ↓
      </button>
      {selectedGallery && (
        <div className="gallery-position-label">
          {isMoving
            ? "Moving..."
            : `${selectedGallery.title} (${selectedIndex + 1} of ${galleries.length})`}
        </div>
      )}
    </div>
  );
};

export default GallerySelector;
