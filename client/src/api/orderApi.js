import axios from "axios";

const API_URL = "https://bookhub-1-d9b3.onrender.com/api";

const API = axios.create({
  baseURL: API_URL,
});

// Attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// CREATE ORDER
export const createOrder = async (orderData) => {
  try {
    const response = await API.post("/orders", orderData);

    console.log("Order API response:", response.data);

    return response.data;
  } catch (error) {
    console.log("Create order error:", error.response?.data || error.message);

    throw error;
  }
};

// GET ORDERS
export const getOrders = async () => {
  const response = await API.get("/orders");

  return response.data;
};

// GET SINGLE ORDER
export const getOrderById = async (id) => {
  const response = await API.get(`/orders/${id}`);

  return response.data;
};

// CANCEL ORDER
export const cancelOrder = async (id) => {
  const response = await API.put(`/orders/${id}/cancel`);

  return response.data;
};
