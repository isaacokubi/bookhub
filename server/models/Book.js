import mongoose from "mongoose";



const bookSchema =
new mongoose.Schema(

{


title:{

type:String,

required:true,

trim:true

},



author:{

type:String,

required:true

},



ISBN:String,



description:String,



price:{

type:Number,

required:true

},



condition:{

type:String,

enum:[

"New",
"Like New",
"Used"

],

default:"Used"

},



category:{

type:
mongoose.Schema.Types.ObjectId,

ref:"Category"

},



language:{

type:String,

default:"English"

},



quantity:{

type:Number,

default:1

},



location:String,



deliveryOptions:[String],



images:[String],



seller:{

type:
mongoose.Schema.Types.ObjectId,

ref:"User",

required:true

},



status:{

type:String,

enum:[

"pending",
"approved",
"rejected"

],

default:"pending"

},



views:{

type:Number,

default:0

}



},

{
timestamps:true
}


);



export default mongoose.model(

"Book",

bookSchema

);