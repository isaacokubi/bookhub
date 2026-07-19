import mongoose from "mongoose";


const orderSchema =
new mongoose.Schema({

buyer:{

type:
mongoose.Schema.Types.ObjectId,

ref:"User",

required:true

},


seller:{

type:
mongoose.Schema.Types.ObjectId,

ref:"User"

},



items:[{

book:{

type:
mongoose.Schema.Types.ObjectId,

ref:"Book"

},


title:String,


quantity:Number,


price:Number

}],



amount:{

type:Number,

required:true

},



sellerAmount:Number,


platformFee:Number,



status:{


type:String,


enum:[

"Pending",

"Paid",

"Processing",

"Shipped",

"Delivered",

"Cancelled",

"Refunded"

],


default:"Pending"


},



paymentStatus:{


type:String,


enum:[

"Pending",

"Paid",

"Failed"

],


default:"Pending"

}



},

{

timestamps:true

}

);


export default mongoose.model(
"Order",
orderSchema
);