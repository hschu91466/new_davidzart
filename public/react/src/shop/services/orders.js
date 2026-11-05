import axios from "../../services/axios";

export const startCheckout = (items, release = null) => {
  return axios.post("/api/orders/checkout.php", { items, release });
};

export const listOrders = () => {
  return axios.get("/api/orders/list.php");
};

export const updateOrderStatus = (orderId, status) => {
  return axios.post("/api/orders/update-status.php", {
    order_id: orderId,
    status: status,
  });
};

export const getOrderCounts = () => {
  return axios.get("/api/orders/counts.php");
};
