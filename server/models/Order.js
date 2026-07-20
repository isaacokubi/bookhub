import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    books: [
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
        },
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    // Platform commission (example: 10%)
    commission: {
      type: Number,
      default: 0,
    },

    // Amount seller receives after commission
    sellerAmount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,

      enum: ["Pending", "Paid", "Failed"],

      default: "Pending",
    },

    status: {
      type: String,

      enum: ["Processing", "Completed", "Cancelled"],

      default: "Processing",
    },

    transactionId: {
      type: String,
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
