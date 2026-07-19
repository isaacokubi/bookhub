import {
stkPush
}
from "../services/mpesaService.js";


import Payment from "../models/Payment.js";

import Order from "../models/Order.js";

import {
createNotification
}
from "../utils/createNotification.js";



export const initiatePayment =
async(req,res)=>{


const {

phone,

amount,

orderId

}=req.body;



const response =
await stkPush(

phone,

amount,

orderId

);



const payment =
await Payment.create({

order:orderId,


merchantRequestID:

response.MerchantRequestID,


checkoutRequestID:

response.CheckoutRequestID,


amount,

phone,


rawResponse:

response

});



res.json({

message:
"STK Push sent",

payment

});


};







export const mpesaCallback =
async(req,res)=>{


console.log(
"M-PESA CALLBACK",
req.body
);



const data =
req.body.Body
?.stkCallback;



if(data){


const payment =
await Payment.findOne({

checkoutRequestID:

data.CheckoutRequestID

});



if(payment){


payment.resultCode =
data.ResultCode;


payment.resultDesc =
data.ResultDesc;



if(data.ResultCode===0){


payment.status="Success";


const order =
await Order.findById(
payment.order
);



order.paymentStatus="Paid";

order.status="Processing";


await order.save();


}


else{


payment.status="Failed";


}



await payment.save();


}


}



res.json({

ResultCode:0,

ResultDesc:"Accepted"

});


};