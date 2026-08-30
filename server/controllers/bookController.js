import mongoose from "mongoose";
import Book from "../models/Book.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import { uploadImage } from "../services/cloudinaryService.js";

export const createBook = async (req, res, next) => {
  try {
    const images = [];
    if (req.files) {
      for (const file of req.files) images.push(await uploadImage(file));
    }
    const book = await Book.create({ ...req.body, images, seller: req.user._id });
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

export const getBooks = async (req, res) => {
  try {
    const { search, category, condition, minPrice, maxPrice, sort, seller } = req.query;
    const filter = { status: "approved" };

    if (search?.trim()) {
      const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: safe, $options: "i" } },
        { author: { $regex: safe, $options: "i" } },
        { ISBN: { $regex: safe, $options: "i" } },
      ];
    }

    if (category?.trim()) {
      const value = category.trim();
      if (mongoose.Types.ObjectId.isValid(value)) {
        filter.category = value;
      } else {
        const safe = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const categoryDoc = await Category.findOne({ name: { $regex: `^${safe}$`, $options: "i" } }).select("_id");
        if (!categoryDoc) return res.json([]);
        filter.category = categoryDoc._id;
      }
    }

    if (seller?.trim()) {
      const value = seller.trim();
      if (mongoose.Types.ObjectId.isValid(value)) {
        filter.seller = value;
      } else {
        const safe = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const sellerDoc = await User.findOne({ role: "seller", isActive: true, name: { $regex: safe, $options: "i" } }).select("_id");
        if (!sellerDoc) return res.json([]);
        filter.seller = sellerDoc._id;
      }
    }

    if (condition?.trim()) filter.condition = condition.trim();

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Book.find(filter)
      .populate("category", "name")
      .populate("seller", "name email avatar rating");

    if (sort === "lowest") query = query.sort("price");
    if (sort === "highest") query = query.sort("-price");
    if (sort === "newest") query = query.sort("-createdAt");

    res.json(await query);
  } catch (error) {
    console.error("Failed loading books:", error);
    res.status(500).json({ message: "Unable to load books right now." });
  }
};

export const getBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, status: "approved" })
      .populate("category", "name")
      .populate("seller", "name email avatar rating");
    if (!book) return res.status(404).json({ message: "Book not found" });
    book.views = (book.views || 0) + 1;
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sellerBooks = async (req, res) => {
  try {
    const books = await Book.find({ seller: req.user._id }).populate("category", "name").sort("-createdAt");
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.seller.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not allowed" });
    Object.assign(book, req.body);
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.seller.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not allowed" });
    await book.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
