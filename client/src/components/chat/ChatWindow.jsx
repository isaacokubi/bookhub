import {
useState
}
from "react";


import useSocket
from "../../hooks/useSocket";



export default function ChatWindow({

userId,

receiverId

}){


const socket =
useSocket(userId);



const [
message,
setMessage
]=useState("");



const send=()=>{


socket.emit(

"sendMessage",

{

receiverId,

senderId:userId,

text:message

}

);



setMessage("");



};



return (

<div>


<div
className="
border
p-5
h-96
"
>


Chat messages


</div>



<div
className="
flex
mt-3
"
>


<input

className="
border
flex-1
p-3
"

value={message}

onChange={
e=>setMessage(e.target.value)
}

/>


<button

onClick={send}

className="
bg-blue-600
text-white
px-5
"

>

Send

</button>



</div>


</div>


);


}