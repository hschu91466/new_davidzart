import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import HomeSlideshow from "../components/home/HomeSlideshow";

const Home = () => {
  const { loading } = useContext(AuthContext);

  if (loading)
    return (
      <p role="status" aria-live="polite">
        Loading...
      </p>
    );

  return (
    <>
      <div className="container">
        <HomeSlideshow />
        <blockquote className="hero-quote" aria-label="Artist statement">
          Through prayer, Bible study, and the quiet practice of painting, I
          continue to look for beauty, truth, and meaning in both the ordinary
          and the extraordinary moments of life.
        </blockquote>
      </div>
    </>
  );
};

export default Home;
