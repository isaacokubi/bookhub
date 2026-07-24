import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/cart`;

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getCart = async () => {
  const { data } = await axios.get(
    API,
    authConfig()
  );

  return data;
};

export const addToCart = async (bookId) => {
  const { data } = await axios.post(
    `${API}/add`,
    { bookId },
    authConfig()
  );

  return data;
};

export const removeFromCart = async (bookId) => {
  const { data } = await axios.delete(
    `${API}/remove/${bookId}`,
    authConfig()
  );

  return data;
};

export const clearCart = async () => {
  const { data } = await axios.delete(
    `${API}/clear`,
    authConfig()
  );

  return data;
};