import express from "express";

import {
  createBook,
  getSellerBooks,
  updateBook,
  deleteBook,
  getPublicSellers,
  getPublicSellerStore,
} from "../controllers/sellerController.js";
import { getSellerOrders } from "../controllers/sellerOrderController.js";
import auth from "../middleware/auth.js";
import sellerOnly from "../middleware/sellerMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public buyer-facing seller discovery and storefronts.
router.get("/public", getPublicSellers);
router.get("/public/:id/books", getPublicSellerStore);

router.post("/books", auth, sellerOnly, upload.single("image"), createBook);
router.get("/books", auth, sellerOnly, getSellerBooks);
router.put("/books/:id", auth, sellerOnly, upload.single("image"), updateBook);
router.delete("/books/:id", auth, sellerOnly, deleteBook);
router.get("/orders", auth, sellerOnly, getSellerOrders);

export default router;
