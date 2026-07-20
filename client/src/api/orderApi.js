import axios from "axios";

const API = axios.create({
  baseURL: "https://bookhub-1-d9b3.onrender.com/api",
});

export const createOrder = (data) => {
  return API.post("/orders", data);
};
