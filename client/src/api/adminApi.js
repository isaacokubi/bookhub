import axios from "axios";

const API = "https://bookhub-1-d9b3.onrender.com/api/admin";

const getToken = () => localStorage.getItem("token");

export const getDashboardStats = async () => {
  const response = await axios.get(`${API}/dashboard`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(`${API}/users`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const getBooks = async () => {
  const response = await axios.get(`${API}/books`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const getOrders = async () => {
  const response = await axios.get(`${API}/orders`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};
