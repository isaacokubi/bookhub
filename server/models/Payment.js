import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    merchantRequestID: String,

    checkoutRequestID: String,

    mpesaReceiptNumber: String,

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    phone: {
      type: String,
      trim: true,
    },

    resultCode: String,

    resultDesc: String,

    transactionDate: String,

    rawResponse: mongoose.Schema.Types.Mixed,

    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent two concurrent checkout requests from creating multiple active
// M-Pesa prompts for the same order. Failed and successful payment attempts
// remain available as history.
paymentSchema.index(
  { order: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "Pending" },
    name: "one_pending_payment_per_order",
  },
);

// A CheckoutRequestID identifies one Safaricom STK request and must never be
// associated with more than one local payment record.
paymentSchema.index(
  { checkoutRequestID: 1 },
  {
    unique: true,
    sparse: true,
    name: "unique_checkout_request_id",
  },
);

export default mongoose.model("Payment", paymentSchema);
