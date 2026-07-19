import mongoose from "mongoose";


const userSchema =
new mongoose.Schema(

{


name:{

type:String,

required:true,

trim:true

},


email:{

type:String,

required:true,

unique:true,

lowercase:true

},


phone:{

type:String,

required:true

},


password:{

type:String,

required:true,

minlength:6

},



role:{

type:String,

enum:[

"buyer",
"seller",
"admin"

],

default:"buyer"

},


avatar:{

type:String,

default:""

},


isActive:{

type:Boolean,

default:true

},


rating:{

average:{
type:Number,
default:0
},

count:{
type:Number,
default:0
}

}


},


{

timestamps:true

}


);



export default mongoose.model(
"User",
userSchema
);