import { useEffect, useState } from "react";
import { listOrders, updateOrderStatus } from "../../services/orders";
import "../../styles/admin-orders.css";

const formatPrice = (cents) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(cents) / 100);

const formatDate = (value) =>
  value
    ? new Date(value.replace(" ", "T")).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

const formatAddress = (json) => {
  try {
    const a = JSON.parse(json);
    if (!a) return "";
    return [
      a.line1,
      a.line2,
      `${a.city}, ${a.state} ${a.postal_code}`,
      a.country,
    ]
      .filter(Boolean)
      .join("\n");
  } catch {
    return "";
  }
};

const STATUS_LABELS = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  cancelled: "Cancelled",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("paid");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setError("");
      const res = await listOrders();
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        setError(res.data.message || "Unable to load orders.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;

    try {
      setUpdatingId(orderId);
      const res = await updateOrderStatus(orderId, newStatus);
      if (!res.data.success) {
        setError(res.data.message || "Unable to update order.");
        return;
      }
      await loadOrders();
    } catch (err) {
      console.error(err);
      setError("Unable to update order.");
    } finally {
      setUpdatingId(null);
    }
  };

  const visibleOrders =
    status === "all" ? orders : orders.filter((o) => o.status === status);

  const tabs = [
    { value: "paid", label: "To Ship" },
    { value: "shipped", label: "Shipped" },
    { value: "all", label: "All" },
  ];

  if (loading) return <p role="status">Loading orders...</p>;

  return (
    <div className="admin-orders-page">
      <h1>Orders</h1>

      <div
        className="button-group filter-tabs"
        role="tablist"
        aria-label="Filter orders by status"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`btn btn-tab ${status === tab.value ? "btn-active" : ""}`}
            onClick={() => setStatus(tab.value)}
            role="tab"
            aria-selected={status === tab.value}
            aria-controls="orders-table"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p role="alert">{error}</p>}

      {visibleOrders.length === 0 ? (
        <p role="status">No orders found.</p>
      ) : (
        <div className="table-wrapper">
          <table
            id="orders-table"
            className="table"
            aria-label="Orders"
            role="table"
          >
            <thead>
              <tr role="row">
                <th scope="col">Status</th>
                <th scope="col">Order</th>
                <th scope="col">Artwork</th>
                <th scope="col">Amount</th>
                <th scope="col">Customer</th>
                <th scope="col">Ship To</th>
                <th scope="col">Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleOrders.map((order) => {
                const isUpdating = updatingId === order.order_id;

                return (
                  <tr key={order.order_id} role="row">
                    <td role="cell" data-label="Status">
                      <span className={`status-badge ${order.status}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>

                    <td role="cell" data-label="Order">
                      #{order.order_id}
                    </td>

                    <td role="cell" data-label="Artwork">
                      {order.items.map((item) => (
                        <div key={item.order_item_id}>
                          <strong>{item.item_title}</strong>
                          {item.quantity > 1 && (
                            <small> × {item.quantity}</small>
                          )}
                        </div>
                      ))}
                    </td>

                    <td role="cell" data-label="Amount">
                      {formatPrice(order.total_cents)}
                    </td>

                    <td role="cell" data-label="Customer">
                      {order.customer_name}
                      <br />
                      <small>{order.customer_email}</small>
                    </td>

                    <td
                      role="cell"
                      data-label="Ship To"
                      className="message-cell order-address"
                    >
                      {formatAddress(order.shipping_address)}
                    </td>

                    <td role="cell" data-label="Date">
                      {formatDate(order.paid_at || order.created_at)}
                    </td>

                    <td
                      role="cell"
                      data-label="Actions"
                      className="button-group"
                    >
                      {order.status === "paid" && (
                        <button
                          className="btn btn-approve btn-sm"
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusChange(
                              order.order_id,
                              "shipped",
                              "Mark this order as shipped?",
                            )
                          }
                          aria-label={`Mark order ${order.order_id} as shipped`}
                        >
                          {isUpdating ? "Saving..." : "Mark Shipped"}
                        </button>
                      )}

                      {order.status === "pending" && (
                        <button
                          className="btn btn-delete btn-sm"
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusChange(
                              order.order_id,
                              "cancelled",
                              "Cancel this unpaid order?",
                            )
                          }
                          aria-label={`Cancel unpaid order ${order.order_id}`}
                        >
                          {isUpdating ? "Saving..." : "Cancel"}
                        </button>
                      )}
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

export default Orders;
