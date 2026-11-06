import axios from "../../services/axios";

export const getShopSettings = () => {
  return axios.get("/api/orders/settings.php");
};

export const updateShopSettings = (storeOpen) => {
  return axios.post("/api/orders/settings-update.php", {
    store_open: storeOpen,
  });
};

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
