import {
useState
}
from "react";


import {
registerUser
}
from "../../api/authApi";


import {
useNavigate
}
from "react-router-dom";



export default function RegisterForm(){


const navigate=useNavigate();



const [form,setForm]=useState({

name:"",
email:"",
phone:"",
password:""

});



const submit=async(e)=>{


e.preventDefault();



try{


await registerUser(form);


navigate("/login");


}

catch(err){

alert(
err.response?.data?.message ||
"Registration failed"
);

}


};



return (

<form

onSubmit={submit}

className="
space-y-4
"

>


<input

placeholder="Full Name"

className="input border p-3 w-full rounded"

onChange={
e=>
setForm({
...form,
name:e.target.value
})
}

/>


<input

placeholder="Email"

className="border p-3 w-full rounded"

onChange={
e=>
setForm({
...form,
email:e.target.value
})
}

/>


<input

placeholder="Phone Number"

className="border p-3 w-full rounded"

onChange={
e=>
setForm({
...form,
phone:e.target.value
})
}

/>


<input

type="password"

placeholder="Password"

className="border p-3 w-full rounded"

onChange={
e=>
setForm({
...form,
password:e.target.value
})
}

/>



<button

className="
bg-blue-600
text-white
p-3
rounded
w-full
"

>

Create Account

</button>



</form>

);


}