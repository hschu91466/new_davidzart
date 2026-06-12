import { useEffect, useState } from "react";
import axios from "../../services/axios";

const Galleries = () => {
  const [galleries, setGalleries] = useState([]);
  const [galleryId, setGalleryId] = useState("");
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
      console.log("Upload success", res.data);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await axios.get("/api/galleries/list.php");
        console.log("API response:", res.data);
        setGalleries(res.data);
      } catch (error) {
        console.error("Error fetching galleries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  if (loading) {
    return <div>Loading galleries ...</div>;
  }

  return (
    <div>
      <h2>Galleries Page</h2>

      {galleries.length === 0 ? (
        <p>No galleries found</p>
      ) : (
        <ul>
          {galleries.map((gallery) => (
            <li key={gallery.gallery_id}>{gallery.title}</li>
          ))}
        </ul>
      )}

      <select value={galleryId} onChange={(e) => setGalleryId(e.target.value)}>
        <option value="">Select Gallery</option>
        {galleries.map((g) => (
          <option key={g.gallery_id} value={g.gallery_id}>
            {g.title}
          </option>
        ))}
      </select>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadImage}>Upload</button>
    </div>
  );
};

export default Galleries;
