import User from "../models/User.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("seller", "name email");

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("books.book", "title")
      .populate("books.seller", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      users: totalUsers,
      books: totalBooks,
      orders: totalOrders,
      sellers: await User.countDocuments({ role: "seller" }),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
