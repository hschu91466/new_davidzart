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
        <input
          type="text"
          placeholder="Gallery title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
        <div>
          <button
            className="btn btn-primary btn-sm"
            onClick={onSave}
            disabled={saving}
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