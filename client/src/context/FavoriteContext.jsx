import { createContext, useContext, useEffect, useState } from "react";

import {
  getFavorites,
  addFavorite as addFavoriteApi,
  removeFavorite as removeFavoriteApi,
} from "../api/favoriteApi";

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      loadFavorites();
    }
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await getFavorites();

      console.log("Favorites API response:", res.data);

      setFavorites(res.data.map((item) => item.book));
    } catch (error) {
      console.log(
        "Loading favorites failed:",
        error.response?.data || error.message,
      );

      setFavorites([]);
    }
  };

  const addFavorite = async (book) => {
    try {
      // FIX: send only the book ID
      await addFavoriteApi(book._id);

      // Avoid duplicates
      setFavorites((prev) => {
        const exists = prev.some((item) => item._id === book._id);

        if (exists) return prev;

        return [...prev, book];
      });

      // Optional: refresh from backend
      await loadFavorites();
    } catch (error) {
      console.log(
        "Add favorite failed:",
        error.response?.data || error.message,
      );
    }
  };

  const removeFavorite = async (id) => {
    try {
      await removeFavoriteApi(id);

      setFavorites((prev) => prev.filter((book) => book._id !== id));
    } catch (error) {
      console.log(
        "Remove favorite failed:",
        error.response?.data || error.message,
      );
    }
  };

  const isFavorite = (id) => {
    return favorites.some((book) => book._id === id);
  };

  console.log("Favorites state:", favorites);

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        loadFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavorite = () => useContext(FavoriteContext);
