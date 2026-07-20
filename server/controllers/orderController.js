import Order from "../models/Order.js";

import User from "../models/User.js";

import { calculateCommission } from "../utils/commission.js";

import { createNotification } from "../utils/createNotification.js";

import { sendEmail } from "../services/emailService.js";

import { orderCreated } from "../templates/orderCreated.js";

export const createOrder = async (req, res) => {
  const {
    items,

    amount,

    seller,
  } = req.body;

  const {
    fee,

    sellerAmount,
  } = calculateCommission(amount);

  const order = await Order.create({
    buyer: req.user._id,

    seller,

    items,

    amount,

    platformFee: fee,

    sellerAmount,
  });

  await createNotification({
    user: req.user._id,

    title: "Order Created",

    message: "Your order was created successfully.",

    type: "ORDER",

    link: `/orders/${order._id}`,
  });

  // Send order confirmation email

  const buyer = await User.findById(req.user._id);

  await sendEmail(
    buyer.email,

    "Order Created",

    orderCreatedTemplate(order),
  );

  res.status(201).json(order);
};

export const myOrders = async (req, res) => {
  const orders = await Order.find({
    buyer: req.user._id,
  }).populate("items.book");

  res.json(orders);
};

export const sellerOrders = async (req, res) => {
  const orders = await Order.find({
    seller: req.user._id,
  });

  res.json(orders);
};
