import Order from "../models/Order.js";
import Book from "../models/Book.js";
import Payment from "../models/Payment.js";
import { expireStalePendingPayments } from "../services/paymentService.js";

const toPositiveInt = (value, fallback = 1) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
};

export const createOrder = async (req, res) => {
  try {
    const { books } = req.body;

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ message: "At least one book is required" });
    }

    const orderBooks = [];
    let calculatedTotal = 0;

    for (const item of books) {
      const bookId = item?.book?._id || item?.book || item?.bookId || item?._id;
      if (!bookId) {
        return res.status(400).json({ message: "Each order item must include a book" });
      }

      const book = await Book.findById(bookId).select("price seller quantity status");
      if (!book) return res.status(404).json({ message: "Book not found" });
      if (book.status !== "approved") {
        return res.status(400).json({ message: "One or more selected books are not available for purchase" });
      }

      const quantity = toPositiveInt(item?.quantity);
      if (quantity > book.quantity) return res.status(400).json({ message: "Insufficient stock for the selected book" });

      const price = Number(book.price);
      calculatedTotal += price * quantity;
      orderBooks.push({ book: book._id, seller: book.seller, price, quantity });
    }

    if (!Number.isFinite(calculatedTotal) || calculatedTotal <= 0) {
      return res.status(400).json({ message: "Order total must be greater than zero" });
    }

    const commission = Number((calculatedTotal * 0.10).toFixed(2));
    const sellerAmount = Number((calculatedTotal - commission).toFixed(2));

    const order = await Order.create({
      user: req.user._id,
      books: orderBooks,
      total: calculatedTotal,
      commission,
      sellerAmount,
      paymentStatus: "Pending",
      status: "Processing",
    });

    return res.status(201).json({
      _id: order._id,
      total: order.total,
      paymentStatus: order.paymentStatus,
      status: order.status,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({ message: "Unable to create order" });
  }
};

export const getOrders = async (req, res) => {
  try {
    await expireStalePendingPayments();

    const orders = await Order.find({ user: req.user._id })
      .populate("books.book", "title author price images")
      .populate("books.seller", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const orderIds = orders.map((order) => order._id);
    const payments = orderIds.length
      ? await Payment.find({ order: { $in: orderIds } })
          .select("order amount phone status resultCode resultDesc mpesaReceiptNumber createdAt updatedAt")
          .sort({ createdAt: -1 })
          .lean()
      : [];

    const latestPaymentByOrder = new Map();
    for (const payment of payments) {
      const key = String(payment.order);
      if (!latestPaymentByOrder.has(key)) latestPaymentByOrder.set(key, payment);
    }

    const result = orders.map((order) => {
      const payment = latestPaymentByOrder.get(String(order._id)) || null;
      const canPay =
        order.paymentStatus === "Failed" &&
        order.status !== "Completed" &&
        order.status !== "Cancelled";

      return {
        ...order,
        payment,
        canPay,
      };
    });

    return res.json(result);
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Unable to load orders" });
  }
};
