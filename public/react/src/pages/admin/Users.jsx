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

  return (
    <div>
      <h1>Manage Users</h1>
      <div>
        <button onClick={() => setStatus("pending")}>Pending</button>
        <button onClick={() => setStatus("approved")}>Approved</button>
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
                      disabled={approvingId === user.id}
                      onClick={async () => {
                        try {
                          setApprovingId(user.id);

                          await axios.post("/api/users/approve.php", {
                            user_id: user.id,
                          });

                          // small delay for smoother UX
                          setTimeout(() => {
                            setUsers((prev) =>
                              prev.filter((u) => u.id !== user.id),
                            );
                            setApprovingId(null);
                          }, 800);
                        } catch (err) {
                          console.error("Error approving user", err);
                          setApprovingId(null);
                        }
                      }}
                    >
                      {approvingId === user.id ? "Approving..." : "Approve"}
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
