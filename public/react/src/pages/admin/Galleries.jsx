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
    <div className="container">
      <h2>Galleries Page</h2>

      {/* {galleries.length === 0 ? (
        <p>No galleries found</p>
      ) : (
        <ul>
          {galleries.map((gallery) => (
            <li key={gallery.gallery_id}>{gallery.title}</li>
          ))}
        </ul>
      )} */}
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
      <h4></h4>
      {images.length === 0 ? (
        <p>Select a gallery to manage it's images.</p>
      ) : (
        <div className="image-grid">
          {images.map((img) => (
            <div className="image-card" key={img.image_id}>
              <img src={img.url} alt="" />
              <button
                className="btn delete-btn"
                onClick={() => handleDelete(img.image_id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Galleries;
