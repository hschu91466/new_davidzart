import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GalleryGrid from "../components/GalleryGrid";

function Galleries() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/galleries.php")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch galleries");
        return res.json();
      })
      .then((data) => {
        setGalleries(data.galleries || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading galleries…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Galleries</h1>

      <GalleryGrid
        galleries={galleries}
        onSelect={(slug) => navigate(`/galleries/${slug}`)}
      />
    </div>
  );
}

export default Galleries;
