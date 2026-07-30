import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

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



  const emptyCart = {

    books: [],

    total: 0,

  };



  const [cart, setCart] = useState(emptyCart);



  const [loading, setLoading] = useState(false);









  /*
  |--------------------------------------------------------------------------
  | NORMALIZE CART RESPONSE
  |--------------------------------------------------------------------------
  |
  | Converts every possible format into:
  |
  | {
  |   books: [],
  |   total: 0
  | }
  |
  |--------------------------------------------------------------------------
  */


  const normalizeCart = (data) => {


    if (!data) {

      return emptyCart;

    }





    // If cart is directly an array
    if (Array.isArray(data)) {


      return {

        books: data,

        total: 0,

      };


    }





    return {


      ...data,



      books:

        data.books ||

        data.items ||

        [],



      total:

        Number(data.total) ||

        0,


    };


  };









  /*
  |--------------------------------------------------------------------------
  | SAVE CART
  |--------------------------------------------------------------------------
  */


  const saveCart = (cartData) => {


    const normalized = normalizeCart(cartData);



    setCart(normalized);



    localStorage.setItem(

      "cart",

      JSON.stringify(normalized)

    );



  };









  /*
  |--------------------------------------------------------------------------
  | LOAD CART
  |--------------------------------------------------------------------------
  */


  const loadCart = async () => {



    try {


      setLoading(true);





      // Logged out user
      if (!user) {


        const savedCart = JSON.parse(

          localStorage.getItem("cart")

        );



        saveCart(savedCart);



        return;


      }







      // Logged in user
      const response = await getCart();



      saveCart(response);





    } catch (error) {


      console.error(

        "Failed to load cart:",

        error

      );





      // fallback to local storage

      const savedCart = JSON.parse(

        localStorage.getItem("cart")

      );



      saveCart(savedCart);





    } finally {


      setLoading(false);


    }


  };









  /*
  |--------------------------------------------------------------------------
  | RELOAD CART WHEN USER CHANGES
  |--------------------------------------------------------------------------
  */


  useEffect(() => {


    loadCart();



  }, [user]);









  /*
  |--------------------------------------------------------------------------
  | ADD TO CART
  |--------------------------------------------------------------------------
  */


  const addBookToCart = async (bookId) => {


    try {


      const response = await addToCartApi(bookId);



      saveCart(response);




    } catch (error) {


      console.error(

        "Failed to add cart item:",

        error

      );


    }


  };









  /*
  |--------------------------------------------------------------------------
  | REMOVE FROM CART
  |--------------------------------------------------------------------------
  */


  const removeBookFromCart = async (bookId) => {


    try {


      const response = await removeFromCartApi(bookId);



      saveCart(response);




    } catch (error) {


      console.error(

        "Failed to remove cart item:",

        error

      );


    }


  };









  /*
  |--------------------------------------------------------------------------
  | CLEAR CART
  |--------------------------------------------------------------------------
  */


  const clearCart = async () => {


    try {


      await clearCartApi();



      setCart(emptyCart);



      localStorage.removeItem(

        "cart"

      );



    } catch (error) {


      console.error(

        "Failed to clear cart:",

        error

      );


    }


  };









  /*
  |--------------------------------------------------------------------------
  | CART COUNT
  |--------------------------------------------------------------------------
  */


  const cartCount =

    cart?.books?.length || 0;









  /*
  |--------------------------------------------------------------------------
  | CART TOTAL
  |--------------------------------------------------------------------------
  */


  const cartTotal = cart?.books?.reduce(


    (sum, item) => {



      const price = Number(

        item.price ||

        item.book?.price ||

        0

      );



      const quantity = Number(

        item.quantity ||

        1

      );



      return sum + (price * quantity);



    },



    0


  );









  return (


    <CartContext.Provider



      value={{


        cart,



        cartCount,



        cartTotal,



        loading,



        loadCart,



        addToCart:

          addBookToCart,



        removeFromCart:

          removeBookFromCart,



        clearCart,



        setCart:

          saveCart,


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

      "useCart must be used inside CartProvider"

    );


  }



  return context;


}