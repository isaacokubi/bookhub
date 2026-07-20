import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },

    amount: {
      type: Number,

      required: true,
    },

    phone: String,

    status: {
      type: String,

      enum: ["Pending", "Approved", "Rejected", "Completed"],

      default: "Pending",
    },

    processedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },

    notes: String,
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("Withdrawal", withdrawalSchema);
