import api from "./axios";

const API = "/seller";

// Public buyer-facing seller directory.
export const getSellers = (params = {}) => api.get(`${API}/public`, { params });

// Public seller storefront.
export const getSellerStore = (sellerId) => api.get(`${API}/public/${sellerId}/books`);

// Seller management APIs.
export const createBook = (data) => api.post(`${API}/books`, data, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const getSellerBooks = () => api.get(`${API}/books`);

export const updateBook = (id, data) => api.put(`${API}/books/${id}`, data, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const deleteBook = (id) => api.delete(`${API}/books/${id}`);

export const getSellerOrders = () => api.get(`${API}/orders`);
