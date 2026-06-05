import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import HomeSlideshow from "../components/HomeSlideshow";

const Home = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="container">
        {user ? <p>Welcome {user.name}</p> : <p>You are not logged in.</p>}
        <HomeSlideshow />
      </div>
    </>
  );
};

export default Home;
