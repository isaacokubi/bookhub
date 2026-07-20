import Book from "../models/Book.js";

// CREATE BOOK
export const createBook = async (req, res) => {
  try {
    const book = await Book.create({
      title: req.body.title,

      author: req.body.author,

      description: req.body.description,

      price: req.body.price,

      category: req.body.category,

      image: req.file ? req.file.path : "",

      seller: req.user._id,
    });

    res.status(201).json({
      message: "Book created successfully",

      book,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SELLER BOOKS
export const getSellerBooks = async (req, res) => {
  try {
    const books = await Book.find({
      seller: req.user._id,
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE BOOK
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,

      req.body,

      {
        new: true,
      },
    );

    res.json(book);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE BOOK
export const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);

    res.json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
