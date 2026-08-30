import api from "./axios";

// All order requests use the shared API client so the configured
// VITE_API_URL and current JWT are used consistently in development
// and production.

export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  console.log("Order API response:", response.data);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/orders");
  console.log("ORDERS API RESPONSE:", response.data);
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await api.put(`/orders/${id}/cancel`);
  return response.data;
};
