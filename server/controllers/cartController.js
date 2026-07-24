import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate("books");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        books: [],
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { bookId } = req.body;

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        books: [],
      });
    }

    const exists = cart.books.some(
      (id) => id.toString() === bookId
    );

    if (!exists) {
      cart.books.push(bookId);
      await cart.save();
    }

    await cart.populate("books");

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

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

    cart.books = cart.books.filter(
      (id) => id.toString() !== bookId
    );

    await cart.save();

    await cart.populate("books");

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (cart) {
      cart.books = [];
      await cart.save();
    }

    res.json({
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};