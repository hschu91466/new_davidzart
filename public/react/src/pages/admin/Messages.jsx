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
    return (
      <div role="status" aria-live="polite">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="messages-page">
      <h1>Contact Messages</h1>
      <div
        className="button-group"
        style={{ marginBottom: "1rem" }}
        role="tablist"
        aria-label="Filter messages by status"
      >
        <button
          className={`btn btn-tab ${filter === "all" ? "btn-active" : ""}`}
          onClick={() => setFilter("all")}
          role="tab"
          aria-selected={filter === "all"}
          aria-controls="messages-table"
        >
          All ({messages.length})
        </button>

        <button
          className={`btn btn-tab ${filter === "new" ? "btn-active" : ""}`}
          onClick={() => setFilter("new")}
          role="tab"
          aria-selected={filter === "new"}
          aria-controls="messages-table"
        >
          New ({messages.filter((m) => !Number(m.is_read)).length})
        </button>

        <button
          className={`btn btn-tab ${filter === "read" ? "btn-active" : ""}`}
          onClick={() => setFilter("read")}
          role="tab"
          aria-selected={filter === "read"}
          aria-controls="messages-table"
        >
          Read ({messages.filter((m) => Number(m.is_read)).length})
        </button>
      </div>
      {!messages || messages.length === 0 ? (
        <p role="status">No messages found.</p>
      ) : (
        <div className="table-wrapper">
          <table
            id="messages-table"
            className="table"
            aria-label="Contact form messages"
          >
            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Message</th>
                <th scope="col">Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMessages.map((msg) => {
                const isRead = Number(msg.is_read) === 1;

                return (
                  <tr
                    key={msg.message_id}
                    className={!isRead ? "row-unread" : ""}
                  >
                    <td>
                      <span
                        className={`status-badge ${
                          isRead ? "approved" : "pending"
                        }`}
                      >
                        {isRead ? "Read" : "New"}
                      </span>
                    </td>

                    <td>{msg.name}</td>
                    <td>{msg.email}</td>

                    <td className="message-cell">{msg.message}</td>

                    <td>
                      {new Date(msg.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>

                    <td className="button-group">
                      {!isRead && (
                        <button
                          className="btn btn-approve btn-sm"
                          onClick={() => handleMarkRead(msg.message_id)}
                          aria-label={`Mark message from ${msg.name} as read`}
                        >
                          Mark Read
                        </button>
                      )}

                      <button
                        className="btn btn-delete btn-sm"
                        onClick={() => handleDelete(msg.message_id)}
                        aria-label={`Delete message from ${msg.name}`}
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
