import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

export const getPaymentTimeoutMs = () => {
  const minutes = Number(process.env.MPESA_PAYMENT_TIMEOUT_MINUTES) || 5;
  return Math.max(1, minutes) * 60 * 1000;
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
  const orderIds = [...new Set(stalePayments.map((payment) => String(payment.order)))];

  await Payment.updateMany(
    { _id: { $in: paymentIds }, status: "Pending" },
    {
      $set: {
        status: "Failed",
        resultDesc: "M-Pesa payment request expired because it was not completed.",
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
