import Wallet from "../models/Wallet.js";

export const createWalletIfMissing = async (seller) => {
  let wallet = await Wallet.findOne({
    seller,
  });

  if (!wallet) {
    wallet = await Wallet.create({
      seller,
    });
  }

  return wallet;
};
