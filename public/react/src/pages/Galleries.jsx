import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {galleries.map((gallery) => (
          <li
            key={gallery.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/galleries/${gallery.slug}`)}
          >
            {gallery.cover_image && (
              <img
                src={`http://localhost:81/sites/production/davidschu_new/public${gallery.cover_image.file_path}`}
                alt={gallery.title}
                style={{ width: "100%", marginBottom: "0.5rem" }}
              />
            )}

            <strong>{gallery.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Galleries;
