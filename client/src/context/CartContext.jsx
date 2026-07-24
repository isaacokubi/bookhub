import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getCart,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  clearCart as clearCartApi,
} from "../api/cartApi";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user's cart from database
  const loadCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);

      const cartData = await getCart();

      setCart(cartData.books || []);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // Reload cart when user logs in/out
  useEffect(() => {
    loadCart();
  }, [user]);

  // Add book to cart
  const addBookToCart = async (bookId) => {
    try {
      const cartData = await addToCartApi(bookId);

      setCart(cartData.books || []);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // Remove book from cart
  const removeBookFromCart = async (bookId) => {
    try {
      const cartData = await removeFromCartApi(bookId);

      setCart(cartData.books || []);
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await clearCartApi();

      setCart([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.length,
        loading,
        loadCart,
        addToCart: addBookToCart,
        removeFromCart: removeBookFromCart,
        clearCart,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}