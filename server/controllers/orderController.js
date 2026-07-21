import Order from "../models/Order.js";
import Book from "../models/Book.js";

// ===============================
// CREATE ORDER
// ===============================
export const createOrder = async (req, res) => {
  try {
    const { books, total } = req.body;

    // Validate books

    if (!books || books.length === 0) {
      return res.status(400).json({
        message: "No books selected",
      });
    }

    // Validate total

    if (!total) {
      return res.status(400).json({
        message: "Total amount is required",
      });
    }

    // Prepare order books

    const orderBooks = await Promise.all(
      books.map(async (item) => {
        const book = await Book.findById(item.book);

        if (!book) {
          throw new Error("Book not found");
        }

        return {
          // Book reference

          book: book._id,

          // Seller from database

          seller: book.seller,

          // Price from database

          price: book.price,
        };
      }),
    );

    // ===============================
    // BOOKHUB COMMISSION
    // ===============================

    const commission = Number(total) * 0.1;

    const sellerAmount = Number(total) - commission;

    // ===============================
    // CREATE ORDER
    // ===============================

    const order = await Order.create({
      user: req.user.id,

      books: orderBooks,

      total: Number(total),

      commission,

      sellerAmount,

      paymentStatus: "Pending",

      status: "Processing",
    });

    console.log("Created Order:", order);

    // Return order to frontend

    return res.status(201).json({
      _id: order._id,

      user: order.user,

      books: order.books,

      total: order.total,

      commission: order.commission,

      sellerAmount: order.sellerAmount,

      paymentStatus: order.paymentStatus,

      status: order.status,
    });
  } catch (error) {
    console.log("Create Order Error:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// GET USER ORDERS
// ===============================

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })

      .populate({
        path: "books.book",

        select: "title author price images",
      })

      .populate({
        path: "books.seller",

        select: "name email",
      })

      .sort({
        createdAt: -1,
      });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
