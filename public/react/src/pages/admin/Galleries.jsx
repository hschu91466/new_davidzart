import { useEffect, useState } from "react";
import axios from "../../services/axios";
import ImageUpload from "../../components/galleries/ImageUpload";
import ImageGrid from "../../components/galleries/ImageGrid";
import GallerySelector from "../../components/galleries/GallerySelector";
import GalleryForm from "../../components/galleries/GalleryForm";

const Galleries = () => {
  const [galleries, setGalleries] = useState([]);
  const [galleryId, setGalleryId] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [showNewGallery, setShowNewGallery] = useState(false);
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryDescription, setNewGalleryDescription] = useState("");
  const [creatingGallery, setCreatingGallery] = useState(false);
  const [editingGallery, setEditingGallery] = useState(false);
  const [movingGalleryId, setMovingGalleryId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingGallery, setSavingGallery] = useState(false);
  const [movingImageId, setMovingImageId] = useState(null);

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

      const galleriesRes = await axios.get("/api/galleries/list.php");
      setGalleries(galleriesRes.data.galleries);

      setGalleryId(newId);

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

  const handleStartEditGallery = () => {
    if (!galleryId) return;

    const selected = galleries.find((g) => g.gallery_id === galleryId);
    if (!selected) return;

    setEditTitle(selected.title || "");
    setEditDescription(selected.description || "");
    setEditingGallery(true);
  };

  const handleDeactivateGallery = async () => {
    if (!galleryId) return;

    const confirmed = window.confirm("Deactivate this gallery?");
    if (!confirmed) return;

    try {
      await axios.post("/api/galleries/toggle.php", {
        gallery_id: galleryId,
        is_active: 0,
      });
      const res = await axios.get("/api/galleries/list.php");
      setGalleries(res.data.galleries);

      setGalleryId(null);
      setImages([]);
    } catch (error) {
      console.error("Deactivate failed", error);
      alert("Failed to deactivate gallery");
    }
  };

  const handleUpdateGallery = async () => {
    if (!editTitle.trim()) {
      alert("Title is required");
      return;
    }

    try {
      setSavingGallery(true);

      await axios.post("/api/galleries/update.php", {
        gallery_id: galleryId,
        title: editTitle,
        description: editDescription,
      });

      const res = await axios.get("/api/galleries/list.php");
      setGalleries(res.data.galleries);

      setEditingGallery(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update gallery");
    } finally {
      setSavingGallery(false);
    }
  };

  const handleMoveImage = async (imageId, direction) => {
    try {
      setMovingImageId(imageId);
      await axios.post("/api/images/move.php", {
        image_id: imageId,
        gallery_id: galleryId,
        direction,
      });

      const currentScroll = window.scrollY;

      setTimeout(() => {
        window.scrollTo({ top: currentScroll });
      }, 0);

      const res = await axios.get(
        `/api/images/list.php?gallery_id=${galleryId}`,
      );

      setImages(res.data.images);
    } catch (error) {
      console.error("Move image failed", error);
    } finally {
      setMovingImageId(null);
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
    } catch (error) {
      console.error(error);
    } finally {
      setSavingId(null);
    }
  };

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

  const handleMoveGallery = async (direction) => {
    if (!galleryId) return;

    try {
      setMovingGalleryId(galleryId);
      await axios.post("/api/galleries/move.php", {
        gallery_id: galleryId,
        direction,
      });

      const res = await axios.get("/api/galleries/list.php");
      setGalleries(res.data.galleries);
    } catch (error) {
      console.error("Move failed", error);
    } finally {
      setMovingGalleryId(null);
    }
  };

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await axios.get("/api/galleries/list.php");
        setGalleries(res.data.galleries);
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
        setImages(res.data.images);
      } catch (error) {
        console.error("Error fetching images", error);
      }
    };
    fetchImages();
  }, [galleryId]);

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        Loading galleries ...
      </div>
    );
  }

  return (
    <div className="container gallery-detail">
      <h1>Manage Galleries</h1>
      <div className="form-group" role="region" aria-label="Gallery management">
        <GallerySelector
          galleries={galleries}
          selectedGalleryId={galleryId}
          onSelect={(id) => setGalleryId(Number(id))}
          onAdd={() => setShowNewGallery((prev) => !prev)}
          onEdit={handleStartEditGallery}
          onDeactivate={handleDeactivateGallery}
          onMove={(id, direction) => handleMoveGallery(direction)}
          movingId={movingGalleryId}
        />
        {showNewGallery && (
          <GalleryForm
            title={newGalleryTitle}
            description={newGalleryDescription}
            onTitleChange={setNewGalleryTitle}
            onDescriptionChange={setNewGalleryDescription}
            onSave={handleCreateGallery}
            onCancel={() => setShowNewGallery(false)}
            saving={creatingGallery}
            saveLabel="Create"
            savingLabel="Creating..."
          />
        )}
        {editingGallery && (
          <GalleryForm
            title={editTitle}
            description={editDescription}
            onTitleChange={setEditTitle}
            onDescriptionChange={setEditDescription}
            onSave={handleUpdateGallery}
            onCancel={() => setEditingGallery(false)}
            saving={savingGallery}
            saveLabel="Save"
            savingLabel="Saving..."
          />
        )}
      </div>

      <div role="region" aria-label="Image upload">
        <ImageUpload
          galleryId={galleryId}
          onUploadSuccess={async () => {
            const res = await axios.get(
              `/api/images/list.php?gallery_id=${galleryId}`,
            );

            setImages(res.data.images);
          }}
        />
      </div>

      {images.length === 0 ? (
        <p role="status">Select a gallery to view and manage its images.</p>
      ) : (
        <ImageGrid
          images={images}
          onChange={handleChange}
          onSave={handleSave}
          onDelete={handleDelete}
          onMove={handleMoveImage}
          savingId={savingId}
          movingImageId={movingImageId}
        />
      )}
    </div>
  );
};

export default Galleries;
