import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function GalleryDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/galleries.php?slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch gallery");
        return res.json();
      })
      .then(setData)
      .catch(console.error);
  }, [slug]);

  if (!data) return <p>Loading gallery…</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <button onClick={() => navigate("/galleries")}>
        ← Back to galleries
      </button>

      <h2>{data.gallery.title}</h2>
      {data.gallery.description && <p>{data.gallery.description}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {data.images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt={img.alt}
            style={{ width: "100%" }}
          />
        ))}
      </div>
    </div>
  );
}

export default GalleryDetail;
