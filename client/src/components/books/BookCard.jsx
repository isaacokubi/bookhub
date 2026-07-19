import {Link} from "react-router-dom";
import {useCart} from "../../context/CartContext";


export default function BookCard({book}){


const {
addToCart
}=useCart();



return (

<div
className="
bg-white
dark:bg-slate-900
rounded-xl
shadow
overflow-hidden
hover:shadow-lg
transition
"
>


<img

src={
book.images?.[0] ||
"https://via.placeholder.com/400"
}

alt={book.title}

className="
h-56
w-full
object-cover
"

/>



<div
className="
p-5
"
>


<h3
className="
font-bold
text-lg
"
>

{book.title}

</h3>


<p
className="
text-gray-500
"
>

{book.author}

</p>


<p
className="
text-blue-600
font-bold
mt-3
"
>

KES {book.price}

</p>



<div
className="
flex
gap-3
mt-5
"
>


<Link

to={`/books/${book._id}`}

className="
border
px-3
py-2
rounded
"

>

View

</Link>



<button

onClick={()=>addToCart(book)}

className="
bg-blue-600
text-white
px-3
py-2
rounded
"

>

Cart

</button>



</div>



</div>


</div>

);


}