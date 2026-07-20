import axios from "axios";

const API = "https://bookhub-1-d9b3.onrender.com/api/seller";

// Create book with image upload
export const createBook = (data) => {
  return axios.post(`${API}/books`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,

      "Content-Type": "multipart/form-data",
    },
  });
};

// Get seller books
export const getSellerBooks = () => {
  return axios.get(`${API}/books`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Update book
export const updateBook = (id, data) => {
  return axios.put(`${API}/books/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,

      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete book
export const deleteBook = (id) => {
  return axios.delete(`${API}/books/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

//get seller order
export const getSellerOrders = () => {
  return axios.get(
    `${API}/orders`,

    config,
  );
};
