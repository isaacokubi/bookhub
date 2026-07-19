import {
useCart
}
from "../context/CartContext";


export default function Cart(){


const {
cart,
removeFromCart
}=useCart();



const total =
cart.reduce(
(sum,item)=>sum+item.price,
0
);



return (

<div
className="
container
mx-auto
py-10
"
>


<h1 className="
text-3xl
font-bold
"
>

Shopping Cart

</h1>



{
cart.map(item=>(

<div
key={item._id}
className="
border
p-4
my-3
flex
justify-between
"
>


<span>
{item.title}
</span>


<span>
KES {item.price}
</span>



<button

onClick={()=>
removeFromCart(item._id)
}

>

Remove

</button>


</div>

))

}



<h2
className="
font-bold
text-xl
mt-5
"
>

Total:
KES {total}

</h2>


</div>

);


}