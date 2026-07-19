import Withdrawal from "../models/Withdrawal.js";

import Wallet from "../models/Wallet.js";



export const requestWithdrawal =
async(req,res)=>{


const {

amount,

phone

}=req.body;



const wallet =
await Wallet.findOne({

seller:req.user._id

});



if(
wallet.availableBalance < amount
)

return res.status(400)
.json({

message:
"Insufficient balance"

});



wallet.availableBalance -= amount;



await wallet.save();



const withdrawal =
await Withdrawal.create({

seller:req.user._id,

amount,

phone

});



res.status(201)
.json(withdrawal);

};





export const myWithdrawals =
async(req,res)=>{


const withdrawals =
await Withdrawal.find({

seller:req.user._id

});


res.json(withdrawals);

};