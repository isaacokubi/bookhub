import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/favorites`;

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const addFavorite = async (bookId) => {
  try {
    const response = await axios.post(API, { bookId }, getAuthConfig());

    return response.data;
  } catch (error) {
    console.error(
      "Add favorite failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getFavorites = async () => {
  try {
    const response = await axios.get(API, getAuthConfig());

    console.log("Favorites API response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Get favorites failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const removeFavorite = async (bookId) => {
  try {
    const response = await axios.delete(`${API}/${bookId}`, getAuthConfig());

    return response.data;
  } catch (error) {
    console.error(
      "Remove favorite failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
