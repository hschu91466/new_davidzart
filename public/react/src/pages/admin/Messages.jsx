import { useEffect, useState } from "react";
import axios from "../../services/axios";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/contact/list.php");

      if (res.data.success) {
        setMessages(res.data.data);
      } else {
        console.error("API error:", res.data.message);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MARK AS READ
  const handleMarkRead = async (id) => {
    try {
      const res = await axios.post("/api/contact/mark-read.php", {
        message_id: id,
      });

      if (res.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.message_id === id ? { ...msg, is_read: 1 } : msg,
          ),
        );
      }
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      const res = await axios.post("/api/contact/delete.php", {
        message_id: id,
      });

      if (res.data.success) {
        setMessages((prev) => prev.filter((msg) => msg.message_id !== id));
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === "all") return true;

    const isRead = Number(msg.is_read) === 1;

    if (filter === "read") return isRead;
    if (filter === "new") return !isRead;

    return true;
  });

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="messages-page">
      <h2>Messages</h2>
      <div className="button-group" style={{ marginBottom: "1rem" }}>
        <button
          className={`btn btn-tab ${filter === "all" ? "btn-active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({messages.length})
        </button>

        <button
          className={`btn btn-tab ${filter === "new" ? "btn-active" : ""}`}
          onClick={() => setFilter("new")}
        >
          New ({messages.filter((m) => !Number(m.is_read)).length})
        </button>

        <button
          className={`btn btn-tab ${filter === "read" ? "btn-active" : ""}`}
          onClick={() => setFilter("read")}
        >
          Read ({messages.filter((m) => Number(m.is_read)).length})
        </button>
      </div>
      {!messages || messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMessages.map((msg) => {
                const isRead = Number(msg.is_read) === 1;

                return (
                  <tr key={msg.message_id} className={!isRead ? "row-unread" : ""}>
                    {/* ✅ STATUS */}
                    <td>
                      <span
                        className={`status-badge ${
                          isRead ? "approved" : "pending"
                        }`}
                      >
                        {isRead ? "Read" : "New"}
                      </span>
                    </td>

                    {/* ✅ DATA */}
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>

                    <td className="message-cell">{msg.message}</td>

                    <td>
                      <small>{msg.created_at}</small>
                    </td>

                    {/* ✅ ACTIONS */}
                    <td className="button-group">
                      {!isRead && (
                        <button
                          className="btn btn-approve btn-sm"
                          onClick={() => handleMarkRead(msg.message_id)}
                        >
                          Mark Read
                        </button>
                      )}

                      <button
                        className="btn btn-delete btn-sm"
                        onClick={() => handleDelete(msg.message_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Messages;
