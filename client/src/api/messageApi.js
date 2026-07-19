import api from "./axios";


export const getMessages =
(id)=>
api.get(
`/messages/${id}`
);



export const sendMessage =
(data)=>
api.post(
"/messages",
data
);