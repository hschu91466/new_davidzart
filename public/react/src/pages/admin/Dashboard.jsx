import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../services/axios.js";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [pendingComments, setPendingComments] = useState(0);
  const [pendingUsers, setPendingUsers] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [commentsRes, dashboardRes, galleriesRes] = await Promise.all([
          axios.get("/api/comments/admin-counts.php"),
          axios.get("/api/admin/dashboard-counts.php"),
          axios.get("/api/galleries/list.php"),
        ]);

        setPendingComments(commentsRes.data?.counts?.pending ?? 0);
        setPendingUsers(dashboardRes.data?.pending_users ?? 0);
        setUnreadMessages(dashboardRes.data?.unread_messages ?? 0);
        setGalleryCount(galleriesRes.data?.galleries?.length ?? 0);
        setPendingOrders(dashboardRes.data?.orders_to_ship ?? 0);

        setLoading(false);
      } catch (error) {
        console.error("Error loading counts", error);
      }
    };
    loadCounts();
  }, []);

  return (
    <div className="admin-dashboard-page">
      <h1>Admin Dashboard</h1>
      <p>Welcome {user?.first_name}</p>
      <p className="admin-dashboard-nav-hint">
        Use the navigation on the left to manage your site content.
      </p>

      <div
        className="admin-dashboard-console"
        role="region"
        aria-label="Quick statistics"
      >
        {loading ? (
          <p role="status" aria-live="polite">
            Loading...
          </p>
        ) : (
          <div className="admin-dashboard-cards">
            <Link
              to="/admin/comments?status=pending"
              className="admin-dashboard-card"
              aria-label="View pending comments"
            >
              <span className="admin-dashboard-count">{pendingComments}</span>
              <span className="admin-dashboard-label">Pending Comments</span>
            </Link>

            <Link
              to="/admin/users?status=pending"
              className="admin-dashboard-card"
              aria-label="View pending users"
            >
              <span className="admin-dashboard-count">{pendingUsers}</span>
              <span className="admin-dashboard-label">Pending Users</span>
            </Link>

            <Link
              to="/admin/messages?status=unread"
              className="admin-dashboard-card"
              aria-label="View new email"
            >
              <span className="admin-dashboard-count">{unreadMessages}</span>
              <span className="admin-dashboard-label">New Email</span>
            </Link>

            <Link
              to="/admin/galleries"
              className="admin-dashboard-card"
              aria-label="View galleries"
            >
              <span className="admin-dashboard-count">{galleryCount}</span>
              <span className="admin-dashboard-label">Galleries</span>
            </Link>
            <Link
              to="/admin/orders"
              className="admin-dashboard-card"
              aria-label="View Pending Orders"
            >
              <span className="admin-dashboard-count">{pendingOrders}</span>
              <span className="admin-dashboard-label">Pending Orders</span>
            </Link>
          </div>
        )}
      </div>

      <nav className="admin-dashboard-links" aria-label="Admin sections">
        <h2>Manage</h2>
        <div className="button-group">
          <Link to="/admin/galleries" className="btn btn-primary">
            Galleries
          </Link>
          <Link to="/admin/comments" className="btn btn-primary">
            Comments
          </Link>
          <Link to="/admin/users" className="btn btn-primary">
            Users
          </Link>
          <Link to="/admin/messages" className="btn btn-primary">
            Messages
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
