import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getFavorites,
  addFavorite as addFavoriteApi,
  removeFavorite as removeFavoriteApi,
} from "../api/favoriteApi";

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      loadFavorites();
    }
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);

      const favoritesData = await getFavorites();

      console.log(
        "Favorites API response:",
        favoritesData
      );

      const books = Array.isArray(favoritesData)
        ? favoritesData
            .filter((item) => item?.book)
            .map((item) => item.book)
        : [];

      setFavorites(books);
    } catch (error) {
      console.log(
        "Loading favorites failed:",
        error.response?.data || error.message
      );

      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (book) => {
    try {
      await addFavoriteApi(book._id);

      setFavorites((prev) => {
        const exists = prev.some(
          (item) => item._id === book._id
        );

        if (exists) return prev;

        return [...prev, book];
      });

      // Sync with backend
      await loadFavorites();
    } catch (error) {
      console.log(
        "Add favorite failed:",
        error.response?.data || error.message
      );
    }
  };

  const removeFavorite = async (id) => {
    try {
      await removeFavoriteApi(id);

      setFavorites((prev) =>
        prev.filter((book) => book._id !== id)
      );
    } catch (error) {
      console.log(
        "Remove favorite failed:",
        error.response?.data || error.message
      );
    }
  };

  const isFavorite = (id) => {
    return favorites.some(
      (book) => book._id === id
    );
  };

  console.log("Favorites state:", favorites);

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        loading,
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

export const useFavorite = () => {
  const context = useContext(FavoriteContext);

  if (!context) {
    throw new Error(
      "useFavorite must be used within a FavoriteProvider"
    );
  }

  return context;
};