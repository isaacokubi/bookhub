import { stkPush } from "../services/mpesaService.js";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import { createNotification } from "../utils/createNotification.js";
import { COMMISSION_RATE } from "../config/commission.js";

export const initiatePayment = async (req, res) => {
  try {
    const { phone, orderId } = req.body;

    if (!phone || !orderId) {
      return res.status(400).json({ message: "Phone and orderId are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "You cannot pay for this order" });
    }
    if (order.paymentStatus === "Paid") {
      return res.status(409).json({ message: "Order is already paid" });
    }

    const amount = Number(order.total);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid order amount" });
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

    return res.status(201).json({ message: "STK Push sent", payment });
  } catch (error) {
    console.error("STK PUSH ERROR:", error);
    return res.status(500).json({ message: "Payment initiation failed" });
  }
};

export const mpesaCallback = async (req, res) => {
  try {
    const data = req.body?.Body?.stkCallback;
    if (!data) return res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    const payment = await Payment.findOne({ checkoutRequestID: data.CheckoutRequestID });
    if (!payment) return res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    payment.resultCode = String(data.ResultCode);
    payment.resultDesc = data.ResultDesc;

    if (Number(data.ResultCode) === 0) {
      const items = data.CallbackMetadata?.Item || [];
      const receipt = items.find((item) => item.Name === "MpesaReceiptNumber")?.Value;
      const transactionDate = items.find((item) => item.Name === "TransactionDate")?.Value;

      payment.status = "Success";
      payment.mpesaReceiptNumber = receipt ? String(receipt) : undefined;
      payment.transactionDate = transactionDate ? String(transactionDate) : undefined;
      await payment.save();

      const order = await Order.findById(payment.order);
      if (order && order.paymentStatus !== "Paid") {
        order.paymentStatus = "Paid";
        order.status = "Processing";
        order.transactionId = payment.mpesaReceiptNumber || payment.checkoutRequestID;
        order.commission = Number((payment.amount * COMMISSION_RATE).toFixed(2));
        order.sellerAmount = Number((payment.amount - order.commission).toFixed(2));
        await order.save();

        if (order.user) {
          await createNotification({
            user: order.user,
            message: "Your order payment was successful",
          });
        }

        for (const item of order.books || []) {
          if (item.seller) {
            await createNotification({
              user: item.seller,
              message: "You received a new paid order",
            });
          }
        }
      }
    } else {
      payment.status = "Failed";
      await payment.save();

      const order = await Order.findById(payment.order);
      if (order && order.paymentStatus !== "Paid") {
        order.paymentStatus = "Failed";
        await order.save();
      }
    }

    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    console.error("CALLBACK ERROR:", error);
    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
};
