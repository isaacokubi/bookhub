import User from "../models/User.js";

import bcrypt from "bcryptjs";

import generateToken from "../utils/generateToken.js";



export const register = async(req,res,next)=>{


try{


const {

name,
email,
phone,
password

}=req.body;



const exists =
await User.findOne({
email
});



if(exists)

return res.status(400).json({

message:"Email already registered"

});



const hashedPassword =
await bcrypt.hash(
password,
12
);



const user =
await User.create({

name,

email,

phone,

password:hashedPassword

});



const token =
generateToken(
user._id
);



res.status(201).json({

message:"Registration successful",

token,

user:{
id:user._id,
name:user.name,
email:user.email,
role:user.role
}

});


}

catch(error){

next(error);

}


};





export const login = async(req,res,next)=>{


try{


const {

email,

password

}=req.body;



const user =
await User.findOne({
email
});



if(!user)

return res.status(401).json({

message:"Invalid credentials"

});



const match =
await bcrypt.compare(

password,

user.password

);



if(!match)

return res.status(401).json({

message:"Invalid credentials"

});



const token =
generateToken(
user._id
);



res.json({

token,

user:{
id:user._id,
name:user.name,
email:user.email,
role:user.role
}

});


}

catch(error){

next(error);

}


};





export const profile =
async(req,res)=>{


res.json(
req.user
);


};