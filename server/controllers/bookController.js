import Book from "../models/Book.js";
import { uploadImage } from "../services/cloudinaryService.js";

// CREATE BOOK

export const createBook = async (req, res, next) => {
  try {
    const images = [];

    if (req.files) {
      for (const file of req.files) {
        const url = await uploadImage(file);

        images.push(url);
      }
    }

    const book = await Book.create({
      ...req.body,

      images,

      seller: req.user._id,
    });

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

// GET ALL BOOKS

export const getBooks = async (req, res) => {
  try {
    const {
      search,

      category,

      condition,

      minPrice,

      maxPrice,

      sort,
    } = req.query;

    let filter = {};

    // Search by title, author, ISBN

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,

            $options: "i",
          },
        },

        {
          author: {
            $regex: search,

            $options: "i",
          },
        },

        {
          ISBN: {
            $regex: search,

            $options: "i",
          },
        },
      ];
    }

    // Filter category

    if (category) {
      filter.category = category;
    }

    // Filter condition

    if (condition) {
      filter.condition = condition;
    }

    // Filter price range

    if (minPrice || maxPrice) {
      filter.price = {
        $gte: minPrice || 0,

        $lte: maxPrice || 999999,
      };
    }

    let booksQuery = Book.find(filter)

      .populate(
        "category",

        "name",
      )

      .populate(
        "seller",

        "name email",
      );

    // Sorting

    if (sort === "lowest") {
      booksQuery = booksQuery.sort("price");
    }

    if (sort === "highest") {
      booksQuery = booksQuery.sort("-price");
    }

    if (sort === "newest") {
      booksQuery = booksQuery.sort("-createdAt");
    }

    const books = await booksQuery;

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE BOOK

export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

      .populate(
        "category",

        "name",
      )

      .populate(
        "seller",

        "name email",
      );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Increase views

    book.views = (book.views || 0) + 1;

    await book.save();

    res.json(book);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SELLER BOOKS

export const sellerBooks = async (req, res) => {
  try {
    const books = await Book.find({
      seller: req.user._id,
    })

      .populate(
        "category",

        "name",
      );

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
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    Object.assign(
      book,

      req.body,
    );

    await book.save();

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
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    await book.deleteOne();

    res.json({
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
