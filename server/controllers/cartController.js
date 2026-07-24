import Cart from "../models/Cart.js";

// ==============================
// GET USER CART
// ==============================
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate({
      path: "books.book",
      select: "title author price images condition seller",
      populate: {
        path: "seller",
        select: "name email",
      },
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        books: [],
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.log("GET CART ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// ADD BOOK TO CART
// ==============================
export const addToCart = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({
        message: "Book ID is required",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    // Create new cart
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,

        books: [
          {
            book: bookId,
            quantity: 1,
          },
        ],
      });
    } else {
      const existingBook = cart.books.find(
        (item) => item.book.toString() === bookId,
      );

      // Increase quantity if book already exists
      if (existingBook) {
        existingBook.quantity += 1;
      } else {
        cart.books.push({
          book: bookId,
          quantity: 1,
        });
      }

      await cart.save();
    }

    await cart.populate({
      path: "books.book",
      select: "title author price images condition seller",
    });

    res.status(200).json(cart);
  } catch (error) {
    console.log("ADD CART ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// REMOVE BOOK FROM CART
// ==============================
export const removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.books = cart.books.filter((item) => item.book.toString() !== bookId);

    await cart.save();

    await cart.populate("books.book");

    res.status(200).json(cart);
  } catch (error) {
    console.log("REMOVE CART ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// CLEAR CART
// ==============================
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (cart) {
      cart.books = [];

      await cart.save();
    }

    res.status(200).json({
      message: "Cart cleared",
    });
  } catch (error) {
    console.log("CLEAR CART ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
