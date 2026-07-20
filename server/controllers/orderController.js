import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { books, total } = req.body;

    const order = await Order.create({
      user: req.user.id,
      books,
      total,
      status: "Paid",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("books")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
