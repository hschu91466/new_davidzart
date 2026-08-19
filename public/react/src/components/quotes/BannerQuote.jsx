import { useState, useEffect } from "react";
import { getQuotes } from "../../services/quotes";

const BannerQuote = () => {
  const [quotes, setQuotes] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const data = await getQuotes();
        setQuotes(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length < 2) return;

    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [quotes]);

  if (quotes.length === 0) return null;

  const current = quotes[quoteIndex];

  return (
    <div
      className="quote-container"
      role="region"
      aria-label="Rotating quotes"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`rotating-quote-text ${visible ? "fade-in" : "fade-out"}`}
      >
        {current.text}
        {current.author && (
          <span className="rotating-quote-author">{current.author}</span>
        )}
      </div>
    </div>
  );
};

export default BannerQuote;
