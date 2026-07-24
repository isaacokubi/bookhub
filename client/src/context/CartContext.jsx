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


  const [cart, setCart] = useState({
    books: [],
  });


  const [loading, setLoading] = useState(false);



  // ==============================
  // LOAD USER CART
  // ==============================
  const loadCart = async () => {

    if (!user) {

      setCart({
        books: [],
      });

      return;
    }


    try {

      setLoading(true);


      const cartData = await getCart();


      // Keep full cart object
      setCart(cartData);


    } catch (error) {

      console.error(
        "Failed to load cart:",
        error
      );


      setCart({
        books: [],
      });


    } finally {

      setLoading(false);

    }

  };





  // Reload when user changes
  useEffect(() => {

    loadCart();

  }, [user]);







  // ==============================
  // ADD TO CART
  // ==============================
  const addBookToCart = async (bookId) => {

    try {

      const cartData = await addToCartApi(bookId);


      setCart(cartData);


    } catch (error) {

      console.error(
        "Failed to add to cart:",
        error
      );

    }

  };







  // ==============================
  // REMOVE FROM CART
  // ==============================
  const removeBookFromCart = async (bookId) => {

    try {

      const cartData = await removeFromCartApi(bookId);


      setCart(cartData);


    } catch (error) {

      console.error(
        "Failed to remove from cart:",
        error
      );

    }

  };








  // ==============================
  // CLEAR CART
  // ==============================
  const clearCart = async () => {

    try {

      await clearCartApi();


      setCart({
        books: [],
      });


    } catch (error) {

      console.error(
        "Failed to clear cart:",
        error
      );

    }

  };








  return (

    <CartContext.Provider

      value={{

        cart,


        // number of books in cart
        cartCount: cart.books?.length || 0,


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

    throw new Error(
      "useCart must be used within CartProvider"
    );

  }


  return context;

}