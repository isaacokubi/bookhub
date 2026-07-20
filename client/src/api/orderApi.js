import axios from "axios";

const API =
  "https://bookhub-1-d9b3.onrender.com/api/orders";

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem(
      "token"
    )}`,
  },
});

export const getOrders = () =>
  axios.get(API, authConfig());

export const createOrder = (data) =>
  axios.post(API, data, authConfig());