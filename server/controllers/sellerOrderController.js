import Order from "../models/Order.js";

export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "books.seller": req.user.id,
    })
      .populate("user", "name email")
      .populate("books.book");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
