import { useEffect, useState } from "react";
import axios from "../../services/axios";

const Galleries = () => {
  const [galleries, setGalleries] = useState([]);
  const [galleryId, setGalleryId] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  const uploadImage = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("gallery_id", galleryId);
    try {
      const res = await axios.post("/api/images/upload.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload success", res.data.data);
      setFile(null);

      if (galleryId) {
        const res = await axios.get(
          `/api/images/list.php?gallery_id=${galleryId}`,
        );
        setImages(res.data.data);
      }
    } catch (error) {
      console.error("Upload error:", error);
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
    try {
      await axios.post("/api/images/update.php", {
        image_id: img.image_id,
        title: img.title,
        caption: img.caption,
        year_created: img.year_created,
      });
      console.log("Saved");
    } catch (error) {
      console.error(error);
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
        <select
          className="form-select"
          value={galleryId || ""}
          onChange={(e) => setGalleryId(e.target.value)}
        >
          <option value="">Select Gallery</option>
          {galleries.map((g) => (
            <option key={g.gallery_id} value={g.gallery_id}>
              {g.title}
            </option>
          ))}
        </select>
      </div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="btn btn-primary" onClick={uploadImage}>
        Upload
      </button>
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
                {/* <button className="btn btn-sm" onClick={() => handleEdit(img)}>
                Edit
              </button> */}

                <button
                  className="btn btn-approve btn-sm"
                  onClick={() => handleSave(img)}
                >
                  Save
                </button>

                <button
                  className="btn btn-delete btn-sm delete-btn"
                  onClick={() => handleDelete(img.image_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Galleries;
