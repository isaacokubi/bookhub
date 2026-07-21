import api from "./axios";

// Get all books
export const getBooks = (params) =>
  api.get("/books", {
    params,
  });

// Get single book
export const getBook = (id) => api.get(`/books/${id}`);

// Public create book
export const createBook = (data) => api.post("/books", data);

// Seller create book listing
export const addBook = (data) => api.post("/seller/books", data);

// Update book
export const updateBook = (id, data) => api.put(`/books/${id}`, data);

// Delete book
export const deleteBook = (id) => api.delete(`/books/${id}`);
