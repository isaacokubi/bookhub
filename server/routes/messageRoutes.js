import express from "express";

import auth from "../middleware/auth.js";

import {
  createConversation,
  sendMessage,
  getMessages,
} from "../controllers/messageController.js";

const router = express.Router();

router.post(
  "/conversation",

  auth,

  createConversation,
);

router.post(
  "/",

  auth,

  sendMessage,
);

router.get(
  "/:id",

  auth,

  getMessages,
);

export default router;
