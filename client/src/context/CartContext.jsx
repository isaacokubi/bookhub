import {
createContext,
useContext,
useState
}
from "react";


const CartContext =
createContext();



export function CartProvider({
children
}){


const [
cart,
setCart
]=useState([]);



const addToCart=(book)=>{


setCart(

[
...cart,
book

]

);


};



const removeFromCart=(id)=>{


setCart(

cart.filter(
item=>item._id!==id
)

);


};



return (

<CartContext.Provider

value={{

cart,

addToCart,

removeFromCart

}}

>

{children}

</CartContext.Provider>

);

}



export const useCart=
()=>useContext(CartContext);