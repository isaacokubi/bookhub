import {
useState
}
from "react";


import {
loginUser
}
from "../../api/authApi";


import {
useNavigate
}
from "react-router-dom";


import {
useAuth
}
from "../../context/AuthContext";



export default function LoginForm(){


const navigate=useNavigate();

const {
setUser
}=useAuth();



const [form,setForm]=useState({

email:"",
password:""

});



const submit=async(e)=>{


e.preventDefault();



try{


const res =
await loginUser(form);



localStorage.setItem(
"token",
res.data.token
);



setUser(res.data.user);



navigate("/");


}
catch(err){

alert(
err.response?.data?.message ||
"Login failed"
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

className="
border
p-3
w-full
rounded
"

placeholder="Email"

onChange={
e=>
setForm({
...form,
email:e.target.value
})
}

/>



<input

type="password"

className="
border
p-3
w-full
rounded
"

placeholder="Password"


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
px-5
py-3
rounded
w-full
"

>

Login

</button>



</form>

);


}