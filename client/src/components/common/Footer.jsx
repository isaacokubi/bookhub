export default function Footer(){


return (

<footer
className="
bg-slate-900
text-white
py-8
mt-10
"
>


<div
className="
container
mx-auto
text-center
"
>

<h3
className="
text-xl
font-bold
"
>

BookHub Kenya

</h3>


<p>
Buy & Sell Books Across Kenya
</p>


<p
className="
mt-3
text-sm
"
>

© {new Date().getFullYear()}
BookHub Kenya. All rights reserved.

</p>


</div>


</footer>

);


}