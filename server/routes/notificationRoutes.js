import express from "express";

import auth from "../middleware/auth.js";

import {
  myNotifications,
  markRead,
  unreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", auth, myNotifications);

router.get("/unread", auth, unreadCount);

router.put("/:id/read", auth, markRead);

export default router;
