import express from "express";

import auth from "../middleware/auth.js";

import { myWallet, releaseFunds } from "../controllers/walletController.js";

const router = express.Router();

router.get(
  "/",

  auth,

  myWallet,
);

router.put(
  "/release/:id",

  auth,

  releaseFunds,
);

export default router;
