import { useState, useEffect } from "react";

const BannerQuote = () => {
  const quotes = [
    "Art enables us to find ourselves and lose ourselves at the same time.",
    "Every artist was first an amateur.",
    "Creativity takes courage.",
    "The purpose of art is washing the dust of daily life off our souls.",
    "Let all that I am praise the Lord; with my whole heart, I will praise His holy name. Psalm 103:1",
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="quote-container">
      <div className={`quote-text ${visible ? "fade-in" : "fade-out"}`}>
        {quotes[quoteIndex]}
      </div>
    </div>
  );
};

export default BannerQuote;
