import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

const MAX_PAYMENT_TIMEOUT_MS = 5 * 60 * 1000;

// M-Pesa checkout requests must never remain Pending for more than five
// minutes. An environment value may shorten the timeout, but can never extend
// the five-minute safety limit.
export const getPaymentTimeoutMs = () => {
  const configuredMinutes = Number(process.env.MPESA_PAYMENT_TIMEOUT_MINUTES);
  const minutes = Number.isFinite(configuredMinutes) && configuredMinutes > 0
    ? configuredMinutes
    : 5;

  return Math.min(minutes * 60 * 1000, MAX_PAYMENT_TIMEOUT_MS);
};

export const expireStalePendingPayments = async () => {
  const cutoff = new Date(Date.now() - getPaymentTimeoutMs());

  const stalePayments = await Payment.find({
    status: "Pending",
    createdAt: { $lt: cutoff },
  })
    .select("_id order")
    .lean();

  if (!stalePayments.length) return 0;

  const paymentIds = stalePayments.map((payment) => payment._id);
  const orderIds = [...new Set(
    stalePayments
      .filter((payment) => payment.order)
      .map((payment) => String(payment.order)),
  )];

  await Payment.updateMany(
    { _id: { $in: paymentIds }, status: "Pending" },
    {
      $set: {
        status: "Failed",
        resultDesc: "M-Pesa payment request expired because it was not completed within 5 minutes.",
      },
    },
  );

  // Only mark an order failed when it has no newer active M-Pesa request.
  // This prevents an older expired request from cancelling a payment retry
  // that is currently still pending.
  for (const orderId of orderIds) {
    const hasActivePayment = await Payment.exists({
      order: orderId,
      status: "Pending",
      createdAt: { $gte: cutoff },
    });

    if (!hasActivePayment) {
      await Order.updateOne(
        { _id: orderId, paymentStatus: "Pending" },
        { $set: { paymentStatus: "Failed" } },
      );
    }
  }

  return stalePayments.length;
};
