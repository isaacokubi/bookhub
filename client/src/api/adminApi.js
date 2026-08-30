import api from "./axios";

const adminRequest = (request) => request;

export const getDashboardStats = async () => {
  const response = await adminRequest(api.get("/admin/dashboard"));
  return response.data;
};

export const getUsers = async () => {
  const response = await adminRequest(api.get("/admin/users"));
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await adminRequest(api.delete(`/admin/users/${id}`));
  return response.data;
};

export const getBooks = async () => {
  const response = await adminRequest(api.get("/admin/books"));
  return response.data;
};

export const getAdminBooks = getBooks;

export const deleteBook = async (id) => {
  const response = await adminRequest(api.delete(`/admin/books/${id}`));
  return response.data;
};

export const getOrders = async () => {
  const response = await adminRequest(api.get("/admin/orders"));
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await adminRequest(api.put(`/admin/orders/${id}`, { status }));
  return response.data;
};

export const getSellers = async () => {
  const response = await adminRequest(api.get("/admin/sellers"));
  return response.data;
};

export const deleteSeller = async (id) => {
  const response = await adminRequest(api.delete(`/admin/sellers/${id}`));
  return response.data;
};
