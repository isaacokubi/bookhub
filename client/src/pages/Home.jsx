import {
Link
}
from "react-router-dom";


export default function Home(){


return (

<div>


<section
className="
py-20
text-center
bg-blue-50
dark:bg-slate-800
"
>


<h1
className="
text-5xl
font-bold
"
>

Find Your Next Great Read

</h1>


<p
className="
mt-5
text-xl
"
>

Buy and sell books securely across Kenya.

</p>


<div
className="
mt-8
flex
justify-center
gap-5
"
>


<Link
to="/books"
className="
bg-blue-600
text-white
px-6
py-3
rounded
"
>

Browse Books

</Link>


<Link
to="/register"
className="
border
px-6
py-3
rounded
"
>

Start Selling

</Link>


</div>


</section>


</div>

);


}