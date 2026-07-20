import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


const CartContext = createContext();


export function CartProvider({ children }) {


  const [cart, setCart] = useState(() => {

    const savedCart =
      localStorage.getItem("cart");

    return savedCart
      ? JSON.parse(savedCart)
      : [];

  });



  // Save cart whenever it changes
  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);




  const addToCart = (book) => {

    setCart((prev)=>{

      const exists = prev.some(
        (item)=>item._id === book._id
      );


      if(exists){

        return prev;

      }


      return [
        ...prev,
        book
      ];

    });

  };




  const removeFromCart = (id) => {

    setCart((prev)=>
      prev.filter(
        (item)=>item._id !== id
      )
    );

  };




  const clearCart = () => {

    setCart([]);

  };




  return (

    <CartContext.Provider

      value={{

        cart,

        addToCart,

        removeFromCart,

        clearCart,

      }}

    >

      {children}

    </CartContext.Provider>

  );

}



export function useCart(){

  return useContext(CartContext);

}