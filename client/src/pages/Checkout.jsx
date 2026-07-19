import {
useState
}
from "react";

import {
useCart
}
from "../context/CartContext";

import {
initiateMpesa
}
from "../api/paymentApi";



export default function Checkout(){


const {
cart
}=useCart();



const [phone,setPhone]=useState("");



const amount =
cart.reduce(
(sum,item)=>sum+item.price,
0
);



const pay=async()=>{


try{


await initiateMpesa({

phone,
amount

});


alert(
"STK Push sent to your phone"
);


}

catch{

alert(
"Payment failed"
);

}


};



return (

<div
className="
container
mx-auto
max-w-xl
py-10
"
>


<h1
className="
text-3xl
font-bold
mb-5
"
>

Checkout

</h1>



<div
className="
border
p-5
rounded
"
>


<p>

Amount:

<b>
KES {amount}
</b>

</p>



<input

placeholder="2547XXXXXXXX"

className="
border
p-3
w-full
mt-5
rounded
"

value={phone}

onChange={
e=>setPhone(e.target.value)
}

/>



<button

onClick={pay}

className="
bg-green-600
text-white
w-full
mt-5
p-3
rounded
"

>

Pay With M-Pesa

</button>


</div>


</div>

);


}