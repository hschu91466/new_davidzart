import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import HomeSlideshow from "../components/HomeSlideshow";

const Home = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {user ? <p>Welcome {user.name}</p> : <p>You are not logged in.</p>}
      <HomeSlideshow />
    </>
  );
};

export default Home;
