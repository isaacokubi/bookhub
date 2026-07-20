import express from "express";

// Seller book controllers
import {
  createBook,
  getSellerBooks,
  updateBook,
  deleteBook,
} from "../controllers/sellerController.js";

// Seller order controller
import { getSellerOrders } from "../controllers/sellerOrderController.js";

// Middleware
import auth from "../middleware/auth.js";

import sellerOnly from "../middleware/sellerMiddleware.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// ==========================
// CREATE BOOK LISTING
// ==========================

router.post("/books", auth, sellerOnly, upload.single("image"), createBook);

// ==========================
// GET SELLER BOOKS
// ==========================

router.get("/books", auth, sellerOnly, getSellerBooks);

// ==========================
// UPDATE BOOK
// ==========================

router.put("/books/:id", auth, sellerOnly, updateBook);

// ==========================
// DELETE BOOK
// ==========================

router.delete("/books/:id", auth, sellerOnly, deleteBook);

// ==========================
// GET SELLER ORDERS
// ==========================

router.get("/orders", auth, sellerOnly, getSellerOrders);

export default router;
