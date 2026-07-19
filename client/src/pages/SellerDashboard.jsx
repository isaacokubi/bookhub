export default function SellerDashboard(){


return (

<div>


<h1
className="
text-4xl
font-bold
"
>

Seller Dashboard

</h1>



<div
className="
grid
md:grid-cols-4
gap-5
mt-8
"
>


{
[
"Total Books",
"Sales",
"Revenue",
"Pending Orders"

].map(item=>(


<div
key={item}
className="
shadow
p-5
rounded
"
>

<h3>
{item}
</h3>


<p className="text-2xl">
0
</p>


</div>


))

}


</div>


</div>


);


}