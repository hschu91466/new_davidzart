import BASE_URL from "../config";
import { useEffect, useState } from "react";

function HomeSlideshow() {
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
    return <div>Loading...</div>;
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
    <div className="home-slideshow">
      <div className="home-slideshow-card">
        <button className="nav prev" onClick={prevSlide}>
          ‹
        </button>
        <div className="home-slideshow-image-wrapper">
          <img
            src={currentImage.image_url}
            alt={currentImage.title}
            className={`home-slideshow-image ${isFading ? "fade-out" : ""}`}
          />
        </div>
        <button className="nav next" onClick={nextSlide}>
          ›
        </button>

        <div className="home-slideshow-title">{currentImage.title}</div>
      </div>
    </div>
  );
}

export default HomeSlideshow;
