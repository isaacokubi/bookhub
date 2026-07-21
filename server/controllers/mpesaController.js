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
    const { phone, amount, orderId } = req.body;

    if (!phone || !amount || !orderId) {
      return res.status(400).json({
        message: "Phone, amount and orderId are required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const response = await stkPush(phone, amount, orderId);

    const payment = await Payment.create({
      order: order._id,

      amount,

      phone,

      merchantRequestID: response.MerchantRequestID,

      checkoutRequestID: response.CheckoutRequestID,

      status: "Pending",

      rawResponse: response,
    });

    res.status(201).json({
      message: "STK Push sent",

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

     
     payment.mpesaReceiptNumber = receiptNumber;

      // SAVE PAYMENT FIRST

      await payment.save();

      // =========================
      // UPDATE EXISTING ORDER
      // =========================

      const order = await Order.findById(payment.order);

      if (order) {
        order.paymentStatus = "Paid";

        order.status = "Processing";

        order.transactionId = payment.mpesaReceipt;

        await order.save();
      }

      // COMMISSION CALCULATION

      const commission = payment.amount * COMMISSION_RATE;

      const sellerAmount = payment.amount - commission;

      console.log({
        commission,

        sellerAmount,
      });

      // =========================
      // NOTIFY BUYER
      // =========================

      if (order?.buyer) {
        await createNotification({
          user: order.buyer,

          message: "Your order payment was successful",
        });
      }

      // =========================
      // NOTIFY SELLERS
      // =========================

      if (order?.books) {
        for (const item of order.books) {
          if (item.seller) {
            await createNotification({
              user: item.seller,

              message: "You received a new paid order",
            });
          }
        }
      }
    } else {
      // PAYMENT FAILED

      payment.status = "Failed";

      await payment.save();
    }

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
