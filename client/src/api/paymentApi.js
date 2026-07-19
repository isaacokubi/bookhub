import api from "./axios";


export const initiateMpesa =
(data)=>
api.post(
"/mpesa/stkpush",
data
);



export const checkPayment =
(id)=>
api.get(
`/mpesa/status/${id}`
);