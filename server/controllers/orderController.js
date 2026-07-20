import Order from "../models/Order.js";

// CREATE ORDER

export const createOrder = async (req, res) => {
  try {
    const { books, total } = req.body;

    const order = await Order.create({
      user: req.user.id,

      books,

      total,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET USER ORDERS

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("books")
      .sort({
        createdAt: -1,
      });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
