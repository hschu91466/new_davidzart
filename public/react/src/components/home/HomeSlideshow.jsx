import { BASE_URL, CDN_BASE } from "../../config";
import { useEffect, useState } from "react";

const HomeSlideshow = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/home-images.php`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
        setCurrentIndex(0);
      })
      .catch((err) => {
        console.error("Error fetching slideshow images;", err);
      });
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setIsFading(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setIsFading(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div role="status" aria-live="polite">
        Loading...
      </div>
    );
  }

  const currentImage = images[currentIndex];

  const nextSlide = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setIsFading(false);
    }, 300);
  };

  const prevSlide = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setIsFading(false);
    }, 300);
  };

  return (
    <div
      className="home-slideshow"
      role="region"
      aria-label="Featured image slideshow"
      aria-live="polite"
    >
      <div className="home-slideshow-card">
        <button
          className="nav prev"
          onClick={prevSlide}
          aria-label="Previous image"
        >
          ‹
        </button>
        <div className="home-slideshow-image-wrapper">
          <img
            src={currentImage.image_url}
            alt={currentImage.title}
            className={`home-slideshow-image ${isFading ? "fade-out" : ""}`}
          />
        </div>
        <button
          className="nav next"
          onClick={nextSlide}
          aria-label="Next image"
        >
          ›
        </button>

        <div className="home-slideshow-title">{currentImage.title}</div>

        <div
          className="slideshow-counter"
          aria-live="polite"
          aria-atomic="true"
        >
          Image {currentIndex + 1} of {images.length}
        </div>
      </div>
    </div>
  );
};

export default HomeSlideshow;
