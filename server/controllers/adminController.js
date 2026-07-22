import User from "../models/User.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";


// =======================
// GET USERS
// =======================

export const getUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password");


    res.json(users);


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// =======================
// GET BOOKS
// =======================

export const getBooks = async (req, res) => {
  try {

    const books = await Book.find()
      .populate("seller", "name email");


    res.json(books);


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// =======================
// GET ORDERS
// =======================

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



// =======================
// DASHBOARD STATS
// =======================

export const getDashboard = async (req, res) => {
  try {

    const users = await User.countDocuments();

    const books = await Book.countDocuments();

    const orders = await Order.countDocuments();


    const sellers = await User.countDocuments({
      role: "seller",
    });


    res.status(200).json({
      users,
      books,
      orders,
      sellers,
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// =======================
// DELETE USER
// =======================

export const deleteUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);


    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }


    await user.deleteOne();


    res.json({
      message: "User deleted successfully",
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// =======================
// DELETE BOOK
// =======================

export const deleteBook = async (req, res) => {
  try {

    const book = await Book.findById(req.params.id);


    if (!book) {

      return res.status(404).json({
        message: "Book not found",
      });

    }


    await book.deleteOne();


    res.json({
      message: "Book deleted successfully",
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// =======================
// UPDATE ORDER STATUS
// =======================

export const updateOrderStatus = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);


    if (!order) {

      return res.status(404).json({
        message: "Order not found",
      });

    }


    order.status = req.body.status;


    await order.save();


    res.json({
      message: "Order status updated",
      order,
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};



// =======================
// GET SELLERS
// =======================

export const getSellers = async (req, res) => {
  try {

    const sellers = await User.find({
      role: "seller",
    }).select("-password");


    res.json(sellers);


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// =======================
// DELETE SELLER
// =======================

export const deleteSeller = async (req, res) => {
  try {

    const seller = await User.findById(req.params.id);


    if (!seller) {

      return res.status(404).json({
        message: "Seller not found",
      });

    }


    if (seller.role !== "seller") {

      return res.status(400).json({
        message: "User is not a seller",
      });

    }


    await seller.deleteOne();


    res.json({
      message: "Seller deleted successfully",
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};