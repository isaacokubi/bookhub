import axios from "axios";

const API = axios.create({
  baseURL: "https://bookhub-1-d9b3.onrender.com/api",
});

// Create a new order
export const createOrder = (data) => {
  return API.post("/orders", data);
};

// Get all orders
export const getOrders = () => {
  return API.get("/orders");
};
