import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {

    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },
    

    merchantRequestID: String,

    checkoutRequestID: String,

    mpesaReceiptNumber: String,

    amount: Number,

    phone: String,

    resultCode: String,

    resultDesc: String,

    transactionDate: String,

    rawResponse: Object,

    status: {
      type: String,

      enum: ["Pending", "Success", "Failed"],

      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Payment", paymentSchema);
