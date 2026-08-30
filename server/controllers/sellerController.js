import mongoose from "mongoose";
import Book from "../models/Book.js";
import User from "../models/User.js";

// Public seller directory. Only active seller accounts are exposed.
export const getPublicSellers = async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const filter = { role: "seller", isActive: true };

    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: safe, $options: "i" } },
        { email: { $regex: safe, $options: "i" } },
      ];
    }

    const sellers = await User.find(filter)
      .select("name avatar rating createdAt")
      .sort({ name: 1 })
      .limit(50)
      .lean();

    const sellerIds = sellers.map((seller) => seller._id);
    const counts = await Book.aggregate([
      { $match: { seller: { $in: sellerIds }, status: "approved" } },
      { $group: { _id: "$seller", count: { $sum: 1 } } },
    ]);

    const countMap = new Map(counts.map((item) => [item._id.toString(), item.count]));
    res.json(sellers.map((seller) => ({
      ...seller,
      bookCount: countMap.get(seller._id.toString()) || 0,
    })));
  } catch (error) {
    console.error("Failed loading public sellers:", error);
    res.status(500).json({ message: "Unable to load sellers right now." });
  }
};

// Public seller storefront. Only approved books are visible to buyers.
export const getPublicSellerStore = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid seller id" });
    }

    const seller = await User.findOne({ _id: id, role: "seller", isActive: true })
      .select("name avatar rating createdAt")
      .lean();
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const books = await Book.find({ seller: seller._id, status: "approved" })
      .populate("category", "name")
      .populate("seller", "name avatar rating")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ seller: { ...seller, bookCount: books.length }, books });
  } catch (error) {
    console.error("Failed loading seller storefront:", error);
    res.status(500).json({ message: "Unable to load this seller right now." });
  }
};

// CREATE BOOK
// Seller listings are published immediately. The public marketplace only
// exposes approved listings, so keeping the status explicit here prevents
// seller-created books from silently remaining in the schema's "pending"
// default and becoming invisible to buyers.
export const createBook = async (req, res) => {
  try {
    const book = await Book.create({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      condition: req.body.condition,
      images: req.file ? [req.file.path] : [],
      seller: req.user._id,
      status: "approved",
    });
    res.status(201).json({ message: "Book published successfully", book });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET SELLER BOOKS
export const getSellerBooks = async (req, res) => {
  try {
    const books = await Book.find({ seller: req.user._id })
      .populate("category")
      .sort("-createdAt");
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE BOOK
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, seller: req.user._id });
    if (!book) return res.status(404).json({ message: "Book not found" });
    Object.assign(book, req.body);
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE BOOK
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
