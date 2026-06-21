import { useEffect, useState } from "react";
import axios from "../../services/axios";

const Galleries = () => {
  const [galleries, setGalleries] = useState([]);
  const [galleryId, setGalleryId] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(false);
  const [showNewGallery, setShowNewGallery] = useState(false);
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryDescription, setNewGalleryDescription] = useState("");
  const [creatingGallery, setCreatingGallery] = useState(false);

  const handleCreateGallery = async () => {
    if (!newGalleryTitle.trim()) {
      alert("Gallery title is required");
      return;
    }

    try {
      setCreatingGallery(true);

      const res = await axios.post("/api/galleries/create.php", {
        title: newGalleryTitle,
        description: newGalleryDescription,
      });

      const newId = res.data.gallery_id;

      // refresh galleries list
      const galleriesRes = await axios.get("/api/galleries/list.php");
      setGalleries(galleriesRes.data.data);

      // auto-select new gallery
      setGalleryId(newId);

      // reset form
      setNewGalleryTitle("");
      setNewGalleryDescription("");
      setShowNewGallery(false);
    } catch (error) {
      console.error("Create gallery error:", error);
      alert("Failed to create gallery");
    } finally {
      setCreatingGallery(false);
    }
  };
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const MAX_SIZE_MB = 20;

    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadMessage(`File too large (max ${MAX_SIZE_MB}MB)`);
      setFile(null);
      return;
    }

    if (selectedFile) {
      setUploadMessage(
        `File: ${selectedFile.name} | Type: ${selectedFile.type} | Size: ${(
          selectedFile.size /
          1024 /
          1024
        ).toFixed(2)} MB`,
      );
    }
  };

  const uploadImage = async () => {
    if (!file) {
      setUploadMessage("Please select a file.");
      return;
    }

    if (!galleryId && galleryId != 0) {
      setUploadMessage("Please select a gallery.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("gallery_id", galleryId);

    let timeoutId;

    try {
      setUploading(true);
      setUploadMessage("Uploading... 0%");

      // ✅ fallback timeout (prevents permanent stuck state)
      timeoutId = setTimeout(() => {
        setUploadMessage("Upload taking too long ❌");
        setUploading(false);
      }, 45000);

      await axios.post("/api/images/upload.php", formData, {
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadMessage(`Uploading... ${percent}%`);
          }
        },
      });

      clearTimeout(timeoutId);

      setUploadMessage("Upload successful ✅");
      setFile(null);
      document.querySelector('input[type="file"]').value = "";

      const res = await axios.get(
        `/api/images/list.php?gallery_id=${galleryId}`,
      );
      setImages(res.data.data);

      // ✅ optional: auto-clear success message
      setTimeout(() => {
        setUploadMessage("");
      }, 3000);
    } catch (error) {
      clearTimeout(timeoutId);

      console.error("Upload error:", error);

      if (error.response?.status === 413) {
        setUploadMessage("File too large. ❌");
      } else if (error.code === "ECONNABORTED") {
        setUploadMessage("Upload timed out ❌");
      } else {
        setUploadMessage(error.response?.data?.message || "Upload failed ❌");
      }
    } finally {
      setUploading(false); // ✅ ALWAYS runs if request resolves
    }
  };

  const handleChange = (id, field, value) => {
    setImages((prev) =>
      prev.map((img) =>
        img.image_id === id ? { ...img, [field]: value } : img,
      ),
    );
  };

  const handleSave = async (img) => {
    setSavingId(img.image_id);
    try {
      await axios.post("/api/images/update.php", {
        image_id: img.image_id,
        title: img.title,
        caption: img.caption,
        year_created: img.year_created,
        medium: img.medium,
        dimensions: img.dimensions,
      });
      console.log("Saved");
    } catch (error) {
      console.error(error);
    } finally {
      setSavingId(null);
    }
  };

  // const handleEdit = () => {};

  const handleDelete = async (imageId) => {
    const confirmed = window.confirm("Delete this image?");
    if (!confirmed) return;

    try {
      await axios.post("/api/images/delete.php", { image_id: imageId });
      setImages((prev) => prev.filter((img) => img.image_id !== imageId));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await axios.get("/api/galleries/list.php");
        console.log("API response:", res.data.data);
        setGalleries(res.data.data);
      } catch (error) {
        console.error("Error fetching galleries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  useEffect(() => {
    if (!galleryId || galleryId === "") return;
    const fetchImages = async () => {
      try {
        const res = await axios.get(
          `/api/images/list.php?gallery_id=${galleryId}`,
        );
        setImages(res.data.data);
      } catch (error) {
        console.error("Error fetching images", error);
      }
    };
    fetchImages();
  }, [galleryId]);

  useEffect(() => {
    console.log("Images:", images);
  }, [images]);

  if (loading) {
    return <div>Loading galleries ...</div>;
  }

  return (
    <div className="container gallery-detail">
      <h2>Galleries Page</h2>
      <div className="form-group">
        {showNewGallery && (
          <div className="form-group" style={{ marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Gallery title"
              value={newGalleryTitle}
              onChange={(e) => setNewGalleryTitle(e.target.value)}
            />

            <textarea
              placeholder="Description (optional)"
              value={newGalleryDescription}
              onChange={(e) => setNewGalleryDescription(e.target.value)}
            />

            <div style={{ marginTop: "5px" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleCreateGallery}
                disabled={creatingGallery}
              >
                {creatingGallery ? "Creating..." : "Create"}
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowNewGallery(false)}
                style={{ marginLeft: "5px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className="gallery-select-row">
          <select
            className="form-select"
            value={galleryId || ""}
            onChange={(e) => setGalleryId(Number(e.target.value))}
          >
            <option value="">Select Gallery</option>
            {galleries.map((g) => (
              <option key={g.gallery_id} value={g.gallery_id}>
                {g.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowNewGallery((prev) => !prev)}
          >
            + Create New Gallery
          </button>
        </div>
      </div>
      {/* <input type="file" onChange={(e) => setFile(e.target.files[0])} /> */}
      <input type="file" onChange={handleFileSelect} />
      <button
        className="btn btn-primary"
        onClick={uploadImage}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploadMessage && <div className="upload-status">{uploadMessage}</div>}
      {images.length === 0 ? (
        <p>Select a gallery to manage it's images.</p>
      ) : (
        <div className="image-grid">
          {images.map((img) => (
            <div className="image-card" key={img.image_id}>
              <img src={img.url} alt="" />
              <div className="form-group">
                <input
                  type="text"
                  value={img.title || ""}
                  onChange={(e) =>
                    handleChange(img.image_id, "title", e.target.value)
                  }
                  placeholder="Title"
                />

                <textarea
                  value={img.caption || ""}
                  onChange={(e) =>
                    handleChange(img.image_id, "caption", e.target.value)
                  }
                  placeholder="Caption"
                />

                <input
                  type="text"
                  value={img.year_created || ""}
                  onChange={(e) =>
                    handleChange(img.image_id, "year_created", e.target.value)
                  }
                  placeholder="Year"
                />
                <input
                  type="text"
                  value={img.medium || ""}
                  onChange={(e) =>
                    handleChange(img.image_id, "medium", e.target.value)
                  }
                  placeholder="Medium"
                />
                <input
                  type="text"
                  value={img.dimensions || ""}
                  onChange={(e) =>
                    handleChange(img.image_id, "dimensions", e.target.value)
                  }
                  placeholder="Dimensions"
                />

                {/* <button className="btn btn-sm" onClick={() => handleEdit(img)}>
                Edit
              </button> */}
                <div className="form-actions">
                  <button
                    className="btn btn-approve btn-sm"
                    onClick={() => handleSave(img)}
                    disabled={savingId === img.image_id}
                  >
                    {savingId === img.image_id ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="btn btn-delete btn-sm delete-btn"
                    onClick={() => handleDelete(img.image_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Galleries;
