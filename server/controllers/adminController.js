import User from "../models/User.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Payout from "../models/Payout.js";
import AuditLog from "../models/AuditLog.js";



export const dashboard =
async(req,res)=>{

const totalUsers =
await User.countDocuments();

const totalBooks =
await Book.countDocuments();

const totalOrders =
await Order.countDocuments();

const totalPayments =
await Payment.countDocuments();

const revenueAgg =
await Order.aggregate([

{
$group:{
_id:null,
revenue:{
$sum:"$platformFee"
}
}
}

]);



res.json({

totalUsers,

totalBooks,

totalOrders,

totalPayments,

revenue:
revenueAgg[0]?.revenue || 0

});

};





export const users =
async(req,res)=>{

const result =
await User.find()
.select("-password");

res.json(result);

};





export const suspendUser =
async(req,res)=>{

const user =
await User.findByIdAndUpdate(

req.params.id,

{
isActive:false
},

{
new:true
}

);



await AuditLog.create({

admin:req.user._id,

action:"SUSPEND_USER",

targetId:user._id

});



res.json(user);

};





export const activateUser =
async(req,res)=>{

const user =
await User.findByIdAndUpdate(

req.params.id,

{
isActive:true
},

{
new:true
}

);



await AuditLog.create({

admin:req.user._id,

action:"ACTIVATE_USER",

targetId:user._id

});



res.json(user);

};





export const deleteUser =
async(req,res)=>{

await User.findByIdAndDelete(
req.params.id
);



await AuditLog.create({

admin:req.user._id,

action:"DELETE_USER",

targetId:req.params.id

});



res.json({

message:"Deleted"

});

};





export const pendingBooks =
async(req,res)=>{

const books =
await Book.find({

status:"pending"

})
.populate(
"seller",
"name"
);

res.json(books);

};





export const approveBook =
async(req,res)=>{

const book =
await Book.findByIdAndUpdate(

req.params.id,

{
status:"approved"
},

{
new:true
}

);



await AuditLog.create({

admin:req.user._id,

action:"APPROVE_BOOK",

targetId:book._id

});



res.json(book);

};





export const rejectBook =
async(req,res)=>{

const book =
await Book.findByIdAndUpdate(

req.params.id,

{
status:"rejected"
},

{
new:true
}

);



await AuditLog.create({

admin:req.user._id,

action:"REJECT_BOOK",

targetId:book._id

});



res.json(book);

};





export const payments =
async(req,res)=>{

const result =
await Payment.find()
.sort("-createdAt");



res.json(result);

};





export const payouts =
async(req,res)=>{

const result =
await Payout.find()
.populate(
"seller",
"name email"
);

res.json(result);

};





export const approvePayout =
async(req,res)=>{

const payout =
await Payout.findByIdAndUpdate(

req.params.id,

{

status:"Approved",

processedBy:req.user._id

},

{
new:true
}

);



await AuditLog.create({

admin:req.user._id,

action:"APPROVE_PAYOUT",

targetId:payout._id

});



res.json(payout);

};