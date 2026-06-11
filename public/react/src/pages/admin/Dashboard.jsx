import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../services/axios.js";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const res = await axios.get("/api/comments/admin-counts.php");
        const countsData = res.data?.counts || {};
        setCounts({
          pending: countsData.pending ?? 0,
          approved: countsData.approved ?? 0,
          total: countsData.total ?? 0,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error loading counts", error);
      }
    };
    loadCounts();
  }, []);

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <p>Welcome {user?.first_name}</p>
      <p>Use the navigation on the left to manage your site content.</p>

      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>
              <Link to="/admin/comments?status=pending">
                Pending Comments: {counts.pending}
              </Link>
            </p>
            <p>
              <Link to="/admin/comments?status=approved">
                Approved Comments: {counts.approved}
              </Link>
            </p>
            <p>Total Comments: {counts.total}</p>
          </>
        )}

        <p>Galleries: --</p>
      </div>
    </div>
  );
};

export default Dashboard;
