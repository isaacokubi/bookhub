import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    books: {
      type: [orderItemSchema],
      required: true,
      validate: (items) => Array.isArray(items) && items.length > 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0.01,
    },
    commission: {
      type: Number,
      default: 0,
      min: 0,
    },
    sellerAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
      index: true,
    },
    status: {
      type: String,
      enum: ["Processing", "Completed", "Cancelled"],
      default: "Processing",
      index: true,
    },
    transactionId: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
