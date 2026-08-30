import "dotenv/config";
import mongoose from "mongoose";
import Book from "../models/Book.js";
import User from "../models/User.js";

/**
 * Repairs legacy seller listings that were created before seller listings
 * were explicitly published as approved.
 *
 * The operation is intentionally idempotent: already-approved books are not
 * modified, and rejected books are preserved for moderation/audit purposes.
 *
 * The function can be called by the CLI migration or during API startup after
 * the application's MongoDB connection has already been established.
 */
export const approveExistingSellerBooks = async () => {
  const sellers = await User.find({ role: "seller" }).select("_id").lean();
  const sellerIds = sellers.map(({ _id }) => _id);

  if (!sellerIds.length) {
    console.log("Seller listing reconciliation: no seller accounts found.");
    return 0;
  }

  const result = await Book.updateMany(
    { seller: { $in: sellerIds }, status: "pending" },
    { $set: { status: "approved" } },
  );

  const modified = result.modifiedCount || 0;
  console.log(`Seller listing reconciliation: approved ${modified} pending seller book(s).`);
  return modified;
};

const runCli = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  await approveExistingSellerBooks();
};

// Only execute the database connection when this file is run directly.
// Importing it from server.js must not create a second MongoDB connection.
const isMainModule = process.argv[1] &&
  new URL(`file://${process.argv[1]}`).href === import.meta.url;

if (isMainModule) {
  runCli()
    .catch((error) => {
      console.error("Failed to approve existing seller books:", error);
      process.exitCode = 1;
    })
    .finally(async () => {
      if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    });
}
