import axios from "./axios";

export const startCheckout = (items) => {
  return axios.post("/api/orders/checkout.php", { items });
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
