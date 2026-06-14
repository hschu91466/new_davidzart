import { useEffect, useState } from "react";
import axios from "../../services/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("pending");
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axios.get(
          `/api/users/admin-list.php?status=${status}`,
        );
        setUsers(res.data.users ?? []);
      } catch (error) {
        console.error("Error loading users", error);
      }
    };

    loadUsers();
  }, [status]);

  const approve = async (userId) => {
    try {
      setApprovingId(userId);

      await axios.post("/api/users/approve.php", {
        user_id: userId,
      });

      // small delay for smoother UX
      setTimeout(() => {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setApprovingId(null);
      }, 800);
    } catch (err) {
      console.error("Error approving user", err);
      setApprovingId(null);
    }
  };

  const deleteUser = async (userId) => {
    try {
      setApprovingId(userId);

      await axios.post("/api/users/delete.php", {
        user_id: userId,
      });

      // small delay for smoother UX
      setTimeout(() => {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setApprovingId(null);
      }, 800);
    } catch (err) {
      console.error("Error denying user", err);
      setApprovingId(null);
    }
  };

  const confirmDelete = () => {
    return window.confirm("Are you sure you want to delete this user?");
  };

  return (
    <div>
      <h1>Manage Users</h1>
      <div className="button-group">
        <button
          className={`btn btn-tab ${status === "pending" ? "btn-active" : "btn-tab"}`}
          onClick={() => setStatus("pending")}
        >
          Pending
        </button>
        <button
          className={`btn btn-tab ${status === "approved" ? "btn-active" : "btn-tab"}`}
          onClick={() => setStatus("approved")}
        >
          Approved
        </button>
      </div>

      {users.length === 0 ? (
        <p>No Users Found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              {status === "pending" && <th>Actions</th>}
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.first_name} {user.last_name}
                </td>
                <td>{user.email}</td>
                <td>{user.is_approved ? "Approved" : "Pending"}</td>
                <td>
                  {!user.is_approved && (
                    <button
                      className="btn btn-approve btn-sm"
                      disabled={approvingId === user.id}
                      onClick={() => approve(user.id)}
                    >
                      {approvingId === user.id ? "Approving..." : "Approve"}
                    </button>
                  )}
                  {!user.is_approved && (
                    <button
                      className="btn btn-delete btn-sm"
                      disabled={approvingId === user.id}
                      onClick={() => {
                        if (!confirmDelete()) return;
                        deleteUser(user.id);
                      }}
                    >
                      {approvingId === user.id ? "Denying..." : "Deny"}
                    </button>
                  )}
                </td>
                <td>{user.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
