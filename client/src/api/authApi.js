import axios from "axios";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


const authApi = axios.create({
  baseURL: API_URL,
});


authApi.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;

  },

  (error) => {
    return Promise.reject(error);
  }
);



export const getProfile = async () => {

  const response =
    await authApi.get("/auth/profile");

  return response.data;

};



export const loginUser = async (data) => {

  const response =
    await authApi.post(
      "/auth/login",
      data
    );

  return response.data;

};



export const registerUser = async (data) => {

  const response =
    await authApi.post(
      "/auth/register",
      data
    );

  return response.data;

};



export default authApi;