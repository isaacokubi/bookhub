import { stkPush } from "../services/mpesaService.js";

import Payment from "../models/Payment.js";

import Order from "../models/Order.js";

import { createNotification } from "../utils/createNotification.js";

// INITIATE STK PUSH
export const initiatePayment = async (req, res) => {
  try {
    const { phone, amount, orderId } = req.body;

    if (!phone || !amount || !orderId) {
      return res.status(400).json({
        message: "Phone, amount and orderId are required",
      });
    }

    const response = await stkPush(phone, amount, orderId);

    const payment = await Payment.create({
      order: orderId,

      merchantRequestID: response.MerchantRequestID,

      checkoutRequestID: response.CheckoutRequestID,

      amount,

      phone,

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

// SAFARICOM CALLBACK
export const mpesaCallback = async (req, res) => {
  try {
    console.log("M-PESA CALLBACK:", JSON.stringify(req.body, null, 2));

    const callback = req.body.Body?.stkCallback;

    if (!callback) {
      return res.json({
        ResultCode: 0,

        ResultDesc: "Accepted",
      });
    }

    const payment = await Payment.findOne({
      checkoutRequestID: callback.CheckoutRequestID,
    });

    if (!payment) {
      console.log("Payment not found");

      return res.json({
        ResultCode: 0,

        ResultDesc: "Accepted",
      });
    }

    payment.resultCode = callback.ResultCode;

    payment.resultDesc = callback.ResultDesc;

    // SUCCESSFUL PAYMENT

    if (callback.ResultCode === 0) {
      payment.status = "Success";

      let receiptNumber = null;

      const items = callback.CallbackMetadata?.Item || [];

      items.forEach((item) => {
        if (item.Name === "MpesaReceiptNumber") {
          receiptNumber = item.Value;
        }
      });

      payment.mpesaReceipt = receiptNumber;

      const order = await Order.findById(payment.order);

      if (order) {
        order.paymentStatus = "Paid";

        order.status = "Processing";

        order.transactionId = receiptNumber;

        await order.save();

        await createNotification({
          user: order.user,

          message: "Your order payment was successful",
        });
      }
    } else {
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
