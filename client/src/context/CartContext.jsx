import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart((prev) => {
      const alreadyExists = prev.some((item) => item._id === book._id);

      if (alreadyExists) {
        return prev;
      }

      return [...prev, book];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,

        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
