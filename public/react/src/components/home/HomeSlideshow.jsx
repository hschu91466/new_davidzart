import { BASE_URL } from "../../config";
import { useEffect, useState, useRef } from "react";

const HomeSlideshow = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

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
    if (images.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setIsFading(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setIsFading(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, [images.length, isPaused]);

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

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  };

  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    if (deltaX > SWIPE_THRESHOLD) {
      prevSlide();
    } else if (deltaX < -SWIPE_THRESHOLD) {
      nextSlide();
    }

    touchStartX.current = null;
  };

  return (
    <div
      className="home-slideshow"
      role="region"
      aria-label="Featured image slideshow"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="home-slideshow-card">
        <div
          className="home-slideshow-image-wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={currentImage.image_url}
            alt={currentImage.title}
            className={`home-slideshow-image ${isFading ? "fade-out" : ""}`}
          />

          <button
            className="nav prev desktop-nav"
            onClick={prevSlide}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="nav next desktop-nav"
            onClick={nextSlide}
            aria-label="Next image"
          >
            ›
          </button>
          <button
            className="nav pause desktop-nav"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            aria-pressed={isPaused}
          >
            {isPaused ? "▶" : "⏸"}
          </button>
        </div>

        <div className="home-slideshow-controls-mobile">
          <button
            className="nav prev"
            onClick={prevSlide}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="nav pause"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            aria-pressed={isPaused}
          >
            {isPaused ? "▶" : "⏸"}
          </button>
          <button
            className="nav next"
            onClick={nextSlide}
            aria-label="Next image"
          >
            ›
          </button>
        </div>

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
