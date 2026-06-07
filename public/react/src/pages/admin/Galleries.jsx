import { useEffect, useState } from "react";
import axios from "../../services/axios";

const Galleries = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await axios.get("/api/galleries.php");
        console.log("API response:", res.data);
        setGalleries(res.data.galleries);
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
            <li key={gallery.id}>{gallery.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Galleries;
