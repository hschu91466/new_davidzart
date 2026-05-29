import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import CommentList from "../components/comments/CommentList";
import CommentForm from "../components/comments/CommentForm";

function GalleryDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const gallery = data?.gallery;

  useEffect(() => {
    fetch(`${BASE_URL}/api/galleries.php?format=json&slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch gallery");
        return res.json();
      })
      .then(setData)
      .catch(console.error);
  }, [slug]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(data.images[index]);
  };
  const closeLightbox = () => {
    setCurrentIndex(null);
  };

  const currentImage = currentIndex !== null ? data.images[currentIndex] : null;

  let lightboxSrc = "";

  if (currentIndex !== null && data?.images) {
    const current = data.images[currentIndex];
    console.log("CURRENT IMAGE:", currentImage);
    const imagePath = current.file_path || current.url || "";
    lightboxSrc = `${BASE_URL}${imagePath}`;
  }

  // if (!data) return <p>Loading gallery…</p>;
  if (!data || !data.images) return <p>Loading gallery…</p>;
  console.log("Images:", data.images[currentIndex]);

  return (
    <div className="container py-4 gallery-detail">
      <div className="gallery-header">
        <button onClick={() => navigate("/galleries")}>
          ← Back to galleries
        </button>

        <h2>{gallery?.title}</h2>
        {gallery?.description && <p>{gallery.description}</p>}
      </div>

      <div id="galleryGrid" className="gallery-grid">
        {/* {console.log("FULL IMAGES ARRAY:", data.images)} */}
        {data.images &&
          data.images.map((img, index) => {
            const imagePath = img.file_path || img.url || null;
            const src = imagePath ? `${BASE_URL}${imagePath}` : "";

            const orientation = (img.orientation || "").toLowerCase().trim();
            // console.log("first image from state:", data.images[0]);
            const tileClass =
              orientation === "portrait"
                ? "gallery-tile gallery-tile--portrait"
                : "gallery-tile gallery-tile--landscape";

            return (
              <div className={tileClass} key={img.id}>
                <img
                  src={src}
                  alt="Gallery image"
                  onClick={() => openLightbox(index)}
                />
              </div>
            );
          })}
      </div>

      {currentIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button className="lightbox-close" onClick={closeLightbox}>
              x
            </button>
            {/* Left Arrow */}
            <button
              className="lightbox-prev"
              onClick={() =>
                setCurrentIndex(
                  (currentIndex - 1 + data.images.length) % data.images.length,
                )
              }
            >
              ‹
            </button>

            <div className="lightbox-body">
              <div className="lightbox-image">
                <img src={lightboxSrc} alt="" />
              </div>

              <div className="lightbox-comments">
                {currentImage && (
                  <>
                    <CommentList contentId={currentImage.id} key={refreshKey} />

                    <CommentForm
                      contentId={currentImage.id}
                      onSuccess={() => setRefreshKey((k) => k + 1)}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              className="lightbox-next"
              onClick={() =>
                setCurrentIndex((currentIndex + 1) % data.images.length)
              }
            >
              ›
            </button>
            <div className="lightbox-footer">
              <div className="lightbox-meta">
                {currentImage?.title}
                {currentImage?.year_created
                  ? ` (${currentImage.year_created})`
                  : ""}
                {currentImage?.media ? `, ${currentImage.media}` : ""}
                {currentImage?.dimensions ? `, ${currentImage.dimensions}` : ""}
              </div>
              <div className="lightbox-counter">
                {currentIndex + 1} / {data.images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryDetail;
