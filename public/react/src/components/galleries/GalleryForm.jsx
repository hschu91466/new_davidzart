const GalleryForm = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onCancel,
  saving,
  saveLabel,
  savingLabel,
}) => {
  return (
    <div className="form-group">
      <label htmlFor="gallery-title">Gallery Title</label>
      <input
        id="gallery-title"
        type="text"
        placeholder="Gallery title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        required
        aria-required="true"
      />
      <label htmlFor="gallery-description">Description (optional)</label>
      <textarea
        id="gallery-description"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <div>
        <button
          className="btn btn-primary btn-sm"
          onClick={onSave}
          disabled={saving}
          aria-busy={saving}
        >
          {saving ? savingLabel : saveLabel}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GalleryForm;
