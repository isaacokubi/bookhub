import {
useAuth
}
from "../context/AuthContext";


export default function Profile(){


const {
user
}=useAuth();



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

Profile

</h1>


<div
className="
mt-5
border
p-5
rounded
"
>


<p>

Name:
{user?.name}

</p>


<p>

Email:
{user?.email}

</p>


<p>

Role:
{user?.role}

</p>


</div>


</div>


);


}