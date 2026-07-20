import { stkPush } from "../services/mpesaService.js";

import Payment from "../models/Payment.js";

import Order from "../models/Order.js";

import { createNotification } from "../utils/createNotification.js";

import { COMMISSION_RATE } from "../config/commission.js";

// ===============================
// INITIATE STK PUSH
// ===============================

export const initiatePayment = async (req, res) => {
  try {
    const { phone, amount, user, books } = req.body;

    if (!phone || !amount || !books) {
      return res.status(400).json({
        message: "Phone, amount and books are required",
      });
    }

    const response = await stkPush(phone, amount);

    const payment = await Payment.create({
      user,

      books,

      amount,

      phone,

      merchantRequestID: response.MerchantRequestID,

      checkoutRequestID: response.CheckoutRequestID,

      status: "Pending",

      rawResponse: response,
    });

    res.status(201).json({
      message: "STK Push sent successfully",

      payment,
    });
  } catch (error) {
    console.log("STK PUSH ERROR:", error.message);

    res.status(500).json({
      message: "Payment initiation failed",
    });
  }
};

// ===============================
// M-PESA CALLBACK
// ===============================

export const mpesaCallback = async (req, res) => {
  try {
    console.log("M-PESA CALLBACK:", JSON.stringify(req.body, null, 2));

    const data = req.body.Body?.stkCallback;

    if (!data) {
      return res.json({
        ResultCode: 0,

        ResultDesc: "Accepted",
      });
    }

    const payment = await Payment.findOne({
      checkoutRequestID: data.CheckoutRequestID,
    });

    if (!payment) {
      console.log("Payment not found");

      return res.json({
        ResultCode: 0,

        ResultDesc: "Accepted",
      });
    }

    payment.resultCode = data.ResultCode;

    payment.resultDesc = data.ResultDesc;

    // =========================
    // PAYMENT SUCCESSFUL
    // =========================

    if (data.ResultCode === 0) {
      payment.status = "Success";

      let receiptNumber = null;

      const items = data.CallbackMetadata?.Item || [];

      items.forEach((item) => {
        if (item.Name === "MpesaReceiptNumber") {
          receiptNumber = item.Value;
        }
      });

      payment.mpesaReceipt = receiptNumber;

      // CREATE ORDER AFTER PAYMENT

      const commission = payment.amount * COMMISSION_RATE;

      const sellerAmount = payment.amount - commission;

      const order = await Order.create({
        user: payment.user,

        books: payment.books.map((item) => ({
          book: item.book,

          seller: item.seller,

          price: item.price,
        })),

        total: payment.amount,

        commission,

        sellerAmount,

        paymentStatus: "Paid",

        status: "Processing",

        transactionId: payment.mpesaReceipt,
      });

      await order.save();

      // Notify buyer

      await createNotification({
        user: payment.user,

        message: "Your order payment was successful",
      });

      // Notify sellers

      for (const item of payment.books) {
        await createNotification({
          user: item.seller,

          message: "You received a new paid order",
        });
      }
    } else {
      // PAYMENT FAILED

      payment.status = "Failed";
    }

    await payment.save();

    res.json({
      ResultCode: 0,

      ResultDesc: "Accepted",
    });
  } catch (error) {
    console.log("CALLBACK ERROR:", error.message);

    res.json({
      ResultCode: 0,

      ResultDesc: "Accepted",
    });
  }
};
