import Order from "../models/Order.js";
import Favorite from "../models/Favorite.js";
import Payment from "../models/Payment.js";
import { expireStalePendingPayments } from "../services/paymentService.js";

export const getCustomerDashboard = async (req, res) => {
  try {
    await expireStalePendingPayments();

    const [orders, favorites, orderCount, paidOrderCount, pendingPaymentCount, failedPaymentCount, spentResult] =
      await Promise.all([
        Order.find({ user: req.user._id })
          .populate("books.book", "title author price images")
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(),
        Favorite.countDocuments({ user: req.user._id }),
        Order.countDocuments({ user: req.user._id }),
        Order.countDocuments({ user: req.user._id, paymentStatus: "Paid" }),
        Order.countDocuments({ user: req.user._id, paymentStatus: "Pending" }),
        Order.countDocuments({ user: req.user._id, paymentStatus: "Failed" }),
        Order.aggregate([
          { $match: { user: req.user._id, paymentStatus: "Paid" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
      ]);

    const orderIds = orders.map((order) => order._id);
    const payments = orderIds.length
      ? await Payment.find({ order: { $in: orderIds } })
          .select("order status resultDesc createdAt phone")
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
      canPay:
        order.paymentStatus !== "Paid" &&
        order.status !== "Completed" &&
        order.status !== "Cancelled",
    }));

    const spent = Number(spentResult[0]?.total || 0);
    const inProgress = await Order.countDocuments({
      user: req.user._id,
      paymentStatus: "Paid",
      status: "Processing",
    });

    return res.json({
      stats: {
        orders: orderCount,
        paidOrders: paidOrderCount,
        pendingPayments: pendingPaymentCount,
        failedPayments: failedPaymentCount,
        inProgress,
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
