import Order from "../models/Order.js";
import Favorite from "../models/Favorite.js";
import Payment from "../models/Payment.js";
import { expireStalePendingPayments } from "../services/paymentService.js";

export const getCustomerDashboard = async (req, res) => {
  try {
    await expireStalePendingPayments();

    const [orders, favorites] = await Promise.all([
      Order.find({ user: req.user._id })
        .populate("books.book", "title author price images")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Favorite.countDocuments({ user: req.user._id }),
    ]);

    const orderIds = orders.map((order) => order._id);
    const payments = orderIds.length
      ? await Payment.find({ order: { $in: orderIds } })
          .select("order status resultDesc createdAt")
          .sort({ createdAt: -1 })
          .lean()
      : [];

    const latestPaymentByOrder = new Map();
    for (const payment of payments) {
      const key = String(payment.order);
      if (!latestPaymentByOrder.has(key)) latestPaymentByOrder.set(key, payment);
    }

    const enrichedOrders = orders.map((order) => ({
      ...order,
      payment: latestPaymentByOrder.get(String(order._id)) || null,
      canPay: order.paymentStatus !== "Paid" && order.status !== "Completed" && order.status !== "Cancelled",
    }));

    const paidOrders = orders.filter((order) => order.paymentStatus === "Paid");
    const pendingPayments = orders.filter((order) => order.paymentStatus === "Pending");
    const failedPayments = orders.filter((order) => order.paymentStatus === "Failed");
    const spent = paidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

    return res.json({
      stats: {
        orders: orders.length,
        paidOrders: paidOrders.length,
        pendingPayments: pendingPayments.length,
        failedPayments: failedPayments.length,
        inProgress: paidOrders.filter((order) => order.status === "Processing").length,
        spent,
        favorites,
      },
      orders: enrichedOrders,
    });
  } catch (error) {
    console.error("Customer dashboard error:", error);
    return res.status(500).json({ message: "Unable to load customer dashboard" });
  }
};
