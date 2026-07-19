import {
useEffect,
useState
}
from "react";


import api from "../api/axios";



export default function SellerWallet(){


const [
wallet,
setWallet
]=useState(null);



useEffect(()=>{

load();

},[]);



const load =
async()=>{


const res =
await api.get(
"/wallet"
);


setWallet(
res.data
);


};



if(!wallet)

return <div>
Loading...
</div>;



return (

<div
className="
container
mx-auto
py-10
"
>

<h1
className="
text-3xl
font-bold
"
>

Seller Wallet

</h1>


<div
className="
grid
md:grid-cols-4
gap-5
mt-6
"
>


<div className="border p-5">

Available

<h2>

KES {wallet.availableBalance}

</h2>

</div>


<div className="border p-5">

Pending

<h2>

KES {wallet.pendingBalance}

</h2>

</div>


<div className="border p-5">

Earned

<h2>

KES {wallet.totalEarned}

</h2>

</div>


<div className="border p-5">

Withdrawn

<h2>

KES {wallet.totalWithdrawn}

</h2>

</div>


</div>

</div>

);

}