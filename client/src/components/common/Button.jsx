export default function Button({
children,
...props
}){


return (

<button

className="
bg-blue-600
hover:bg-blue-700
text-white
px-5
py-2
rounded-lg
transition
"

{...props}

>

{children}

</button>

);


}