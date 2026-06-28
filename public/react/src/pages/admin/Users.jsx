import { useEffect, useState } from "react";
import axios from "../../services/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("pending");
  const [approvingId, setApprovingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/users/admin-list.php?status=${status}`,
        );
        setUsers(res.data.users ?? []);
      } catch (error) {
        console.error("Error loading users", error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        Loading users...
      </div>
    );
  }

  return (
    <div>
      <h1>Manage Users</h1>
      <div
        className="button-group"
        role="tablist"
        aria-label="Filter users by approval status"
      >
        <button
          className={`btn btn-tab ${status === "pending" ? "btn-active" : "btn-tab"}`}
          onClick={() => setStatus("pending")}
          role="tab"
          aria-selected={status === "pending"}
          aria-controls="users-table"
        >
          Pending
        </button>
        <button
          className={`btn btn-tab ${status === "approved" ? "btn-active" : "btn-tab"}`}
          onClick={() => setStatus("approved")}
          role="tab"
          aria-selected={status === "approved"}
          aria-controls="users-table"
        >
          Approved
        </button>
      </div>

      {users.length === 0 ? (
        <p role="status">No users found</p>
      ) : (
        <div className="table-wrapper">
          <table
            id="users-table"
            className="table"
            aria-label="Users awaiting approval"
          >
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Status</th>
                <th scope="col">Created</th>
                {status === "pending" && <th scope="col">Actions</th>}
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
                    {new Date(user.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td>
                    {!user.is_approved && (
                      <button
                        className="btn btn-approve btn-sm"
                        disabled={approvingId === user.id}
                        onClick={() => approve(user.id)}
                        aria-label={`Approve ${user.first_name} ${user.last_name}`}
                        aria-busy={approvingId === user.id}
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
                        aria-label={`Deny ${user.first_name} ${user.last_name}`}
                        aria-busy={approvingId === user.id}
                      >
                        {approvingId === user.id ? "Denying..." : "Deny"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
