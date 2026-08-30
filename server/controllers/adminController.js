import mongoose from "mongoose";
import User from "../models/User.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load users" });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("seller", "name email").sort({ createdAt: -1 });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load books" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("books.book", "title author price")
      .populate("books.seller", "name email")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load orders" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const [users, books, orders, sellers, paidOrders] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "seller" }),
      Order.find({ paymentStatus: "Paid" }).select("total -_id").lean(),
    ]);

    const revenue = paidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    return res.json({ users, books, orders, sellers, revenue });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load dashboard" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid user ID" });
    if (String(req.user._id) === String(req.params.id)) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete user" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid book ID" });
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    await book.deleteOne();
    return res.json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete book" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid order ID" });

    const statusMap = {
      pending: "Processing",
      processing: "Processing",
      completed: "Completed",
      cancelled: "Cancelled",
      Processing: "Processing",
      Completed: "Completed",
      Cancelled: "Cancelled",
    };
    const status = statusMap[String(req.body.status || "")];
    if (!status) return res.status(400).json({ message: "Invalid order status" });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update order status" });
  }
};

export const getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" }).select("-password").sort({ createdAt: -1 });
    return res.json(sellers);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load sellers" });
  }
};

export const deleteSeller = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid seller ID" });
    const seller = await User.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    if (seller.role !== "seller") return res.status(400).json({ message: "User is not a seller" });

    await seller.deleteOne();
    return res.json({ message: "Seller deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete seller" });
  }
};
