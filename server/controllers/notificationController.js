import Notification
from "../models/Notification.js";



export const myNotifications =
async(req,res)=>{

const notifications =
await Notification.find({

user:req.user._id

})

.sort("-createdAt");



res.json(notifications);

};





export const markRead =
async(req,res)=>{

const notification =
await Notification.findByIdAndUpdate(

req.params.id,

{
read:true
},

{
new:true
}

);



res.json(notification);

};





export const unreadCount =
async(req,res)=>{

const count =
await Notification.countDocuments({

user:req.user._id,

read:false

});



res.json({
count
});

};