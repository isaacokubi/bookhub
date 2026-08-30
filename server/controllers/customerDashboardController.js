import Order from "../models/Order.js";
import Favorite from "../models/Favorite.js";

export const getCustomerDashboard = async (req, res) => {
  try {
    const [orders, favorites] = await Promise.all([
      Order.find({ user: req.user._id }).populate("books.book", "title author price images").sort({ createdAt: -1 }).limit(10).lean(),
      Favorite.countDocuments({ user: req.user._id }),
    ]);
    const paid = orders.filter((o) => o.paymentStatus === "Paid");
    const spent = paid.reduce((sum, o) => sum + Number(o.total || 0), 0);
    return res.json({ stats: { orders: orders.length, paidOrders: paid.length, inProgress: orders.filter(o => o.status === "Processing").length, spent, favorites }, orders });
  } catch (error) { return res.status(500).json({ message: "Unable to load customer dashboard" }); }
};
