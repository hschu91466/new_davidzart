import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../config";

function GalleryDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  // const gallery = data?.galleries?.find((g) => g.slug === slug);
  const gallery = data?.gallery;

  // console.log(data);
  // console.log("BASE_URL:", BASE_URL);

  useEffect(() => {
    fetch(`${BASE_URL}/api/galleries.php?format=json&slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch gallery");
        return res.json();
      })
      .then(setData)
      .catch(console.error);
  }, [slug]);

  // if (!data) return <p>Loading gallery…</p>;
  if (!data || !data.images) return <p>Loading gallery…</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <button onClick={() => navigate("/galleries")}>
        ← Back to galleries
      </button>

      <h2>{gallery?.title}</h2>
      {gallery?.description && <p>{gallery.description}</p>}

      <div id="galleryGrid">
        {/* {console.log("FULL IMAGES ARRAY:", data.images)} */}
        {data.images &&
          data.images.map((img) => {
            const imagePath = img.file_path || img.url || null;
            const src = imagePath ? `${BASE_URL}${imagePath}` : "";
            const orientation = (img.orientation || "").toLowerCase().trim();
            // console.log("first image from state:", data.images[0]);
            const tileClass =
              orientation === "portrait"
                ? "tile tile--portrait"
                : "tile tile--landscape";

            return (
              <div className={tileClass} key={img.id}>
                <img src={src} alt="Gallery image" />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default GalleryDetail;
