import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GalleryGrid from "../components/galleries/GalleryGrid";
import { BASE_URL, CDN_BASE } from "../config";

function Galleries() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/galleries.php?format=json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch galleries");
        return res.json();
      })
      .then((data) => {
        console.log("JSON:", data);
        setGalleries(data.galleries || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="container">
        <p role="status" aria-live="polite">
          Loading galleries…
        </p>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <p role="alert" aria-live="assertive">
          Error: {error}
        </p>
      </div>
    );

  return (
    <div className="container py-4 gallery-detail">
      <h1>Galleries</h1>

      <GalleryGrid
        galleries={galleries}
        onSelect={(slug) => navigate(`/galleries/${slug}`)}
        aria-label="Available galleries"
      />
    </div>
  );
}

export default Galleries;
