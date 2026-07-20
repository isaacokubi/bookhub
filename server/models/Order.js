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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Paid",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
