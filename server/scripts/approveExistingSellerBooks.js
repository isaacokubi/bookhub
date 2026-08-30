import "dotenv/config";
import mongoose from "mongoose";
import Book from "../models/Book.js";
import User from "../models/User.js";

const run = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is required");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const sellers = await User.find({ role: "seller" }).select("_id").lean();
    const sellerIds = sellers.map(({ _id }) => _id);

    if (!sellerIds.length) {
      console.log("No seller accounts found. Nothing to update.");
      return;
    }

    const result = await Book.updateMany(
      { seller: { $in: sellerIds }, status: "pending" },
      { $set: { status: "approved" } },
    );

    console.log(`Approved ${result.modifiedCount} existing seller book(s).`);
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error("Failed to approve existing seller books:", error);
  process.exitCode = 1;
});
