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
    <div
      className="gallery-select-row"
      role="group"
      aria-label="Gallery controls"
    >
      <label htmlFor="gallery-select">Select Gallery</label>
      <select
        id="gallery-select"
        className="form-select"
        value={selectedGalleryId}
        onChange={(e) => onSelect(e.target.value)}
        aria-label="Available galleries"
      >
        <option value="">Select Gallery</option>
        {galleries.map((g) => (
          <option key={g.gallery_id} value={g.gallery_id}>
            {g.title}
          </option>
        ))}
      </select>
      <button
        className="btn btn-small"
        onClick={onAdd}
        aria-label="Add new gallery"
      >
        +
      </button>
      <button
        className="btn btn-small"
        onClick={() => onEdit(selectedGalleryId)}
        disabled={!selectedGalleryId}
        aria-label="Edit selected gallery"
      >
        Edit
      </button>
      <button
        className="btn btn-small"
        onClick={() => onDeactivate(selectedGalleryId)}
        disabled={!selectedGalleryId}
        aria-label="Delete selected gallery"
      >
        Delete
      </button>
      <button
        className="btn btn-small"
        onClick={() => onMove(selectedGalleryId, "up")}
        disabled={!selectedGalleryId || movingId === selectedGalleryId}
        aria-label="Move gallery up"
        aria-busy={isMoving}
      >
        ↑
      </button>
      <button
        className="btn btn-small"
        onClick={() => onMove(selectedGalleryId, "down")}
        disabled={!selectedGalleryId || movingId === selectedGalleryId}
        aria-label="Move gallery down"
        aria-busy={isMoving}
      >
        ↓
      </button>
      {selectedGallery && (
        <div
          className="gallery-position-label"
          role="status"
          aria-live="polite"
        >
          {isMoving
            ? "Moving..."
            : `${selectedGallery.title} (${selectedIndex + 1} of ${galleries.length})`}
        </div>
      )}
    </div>
  );
};

export default GallerySelector;
