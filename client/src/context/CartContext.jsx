import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const getCartKey = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      return user?._id ? `cart_${user._id}` : "cart_guest";
    } catch (error) {
      return "cart_guest";
    }
  };

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem(getCartKey());

      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);

      return [];
    }
  };

  const [cart, setCart] = useState(loadCart);

  // Reload cart when user changes
  useEffect(() => {
    setCart(loadCart());
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(getCartKey(), JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cart]);

  const addToCart = (book) => {
    setCart((prev) => {
      const exists = prev.some((item) => item._id === book._id);

      if (exists) {
        return prev;
      }

      return [...prev, book];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);

    try {
      localStorage.removeItem(getCartKey());
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const cartCount = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
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
