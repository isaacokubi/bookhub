import Wallet from "../models/Wallet.js";

import Order from "../models/Order.js";

import { createWalletIfMissing } from "../utils/wallet.js";

export const releaseFunds = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order.status !== "Delivered")
    return res.status(400).json({
      message: "Order not delivered",
    });

  const wallet = await createWalletIfMissing(order.seller);

  wallet.availableBalance += order.sellerAmount;

  wallet.totalEarned += order.sellerAmount;

  await wallet.save();

  res.json({
    message: "Funds released",
  });
};

export const myWallet = async (req, res) => {
  const wallet = await createWalletIfMissing(req.user._id);

  res.json(wallet);
};
