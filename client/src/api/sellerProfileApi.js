import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const sellerProfileApi = axios.create({ baseURL: API_URL });

sellerProfileApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const uploadSellerProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await sellerProfileApi.put("/sellers/profile/avatar", formData);
  return response.data;
};

export default sellerProfileApi;
