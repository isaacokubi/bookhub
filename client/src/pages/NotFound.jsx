import {
Link
}
from "react-router-dom";


export default function NotFound(){


return (

<div
className="
text-center
py-20
"
>


<h1
className="
text-6xl
font-bold
"
>

404

</h1>


<p>
Page Not Found
</p>



<Link

to="/"

className="
text-blue-600
"

>

Go Home

</Link>


</div>

);


}