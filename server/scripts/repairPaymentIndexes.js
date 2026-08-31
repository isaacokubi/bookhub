import "dotenv/config";
import mongoose from "mongoose";
import Payment from "../models/Payment.js";

const LEGACY_INDEXES = ["checkoutRequestId_1"];

try {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required.");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const indexes = await Payment.collection.indexes();
  const existingNames = new Set(indexes.map((index) => index.name));

  for (const indexName of LEGACY_INDEXES) {
    if (existingNames.has(indexName)) {
      await Payment.collection.dropIndex(indexName);
      console.log(`Dropped legacy Payment index: ${indexName}`);
    }
  }

  await Payment.syncIndexes();

  const repairedIndexes = await Payment.collection.indexes();
  console.log("Payment indexes after repair:");
  for (const index of repairedIndexes) {
    console.log({
      name: index.name,
      key: index.key,
      unique: index.unique || false,
      sparse: index.sparse || false,
      partialFilterExpression: index.partialFilterExpression || null,
    });
  }

  console.log("PAYMENT INDEX REPAIR: PASSED");
} catch (error) {
  console.error("PAYMENT INDEX REPAIR: FAILED");
  console.error(error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
