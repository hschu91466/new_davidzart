import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import HomeSlideshow from "../components/HomeSlideshow";

const Home = () => {
  const { loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="container">
        <HomeSlideshow />
      </div>
    </>
  );
};

export default Home;
