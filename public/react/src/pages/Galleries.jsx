import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GalleryGrid from "../components/GalleryGrid";
import BASE_URL from "../config";

function Galleries() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/galleries.php?format=json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch galleries");
        return res.json(); // ✅ BACK TO JSON
      })
      .then((data) => {
        console.log("JSON:", data); // keep this
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
    <div className="container py-4 gallery-detail">
      <h1>Galleries</h1>

      <GalleryGrid
        galleries={galleries}
        onSelect={(slug) => navigate(`/galleries/${slug}`)}
      />
    </div>
  );
}

export default Galleries;
