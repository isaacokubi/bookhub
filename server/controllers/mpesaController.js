import { stkPush } from "../services/mpesaService.js";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import { createNotification } from "../utils/createNotification.js";
import { COMMISSION_RATE } from "../config/commission.js";
import { expireStalePendingPayments, getPaymentTimeoutMs } from "../services/paymentService.js";

const getPaymentState = (payment) => ({
  status: payment?.status || "Failed",
  resultDesc: payment?.resultDesc || "",
  createdAt: payment?.createdAt || null,
  checkoutRequestID: payment?.checkoutRequestID || null,
  phone: payment?.phone || null,
});

export const initiatePayment = async (req, res) => {
  const { phone, orderId } = req.body || {};

  try {
    if (!phone || !orderId) return res.status(400).json({ message: "Phone and orderId are required" });

    await expireStalePendingPayments();
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (String(order.user) !== String(req.user._id)) return res.status(403).json({ message: "You cannot pay for this order" });
    if (order.paymentStatus === "Paid") return res.status(409).json({ message: "Order is already paid" });

    const activePayment = await Payment.findOne({
      order: order._id,
      status: "Pending",
      createdAt: { $gte: new Date(Date.now() - getPaymentTimeoutMs()) },
    }).sort({ createdAt: -1 });

    if (activePayment) {
      return res.status(409).json({
        message: "A payment request is already active. Complete the M-Pesa prompt or wait for it to expire before trying again.",
        payment: getPaymentState(activePayment),
      });
    }

    const amount = Number(order.total);
    if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: "Invalid order amount" });

    let response;
    try {
      response = await stkPush(phone, amount, orderId);
    } catch (paymentError) {
      order.paymentStatus = "Failed";
      await order.save();
      await Payment.create({ order: order._id, amount, phone, status: "Failed", resultDesc: paymentError.message || "M-Pesa payment initiation failed." });
      throw paymentError;
    }

    const payment = await Payment.create({
      order: order._id,
      amount,
      phone,
      merchantRequestID: response.MerchantRequestID,
      checkoutRequestID: response.CheckoutRequestID,
      status: "Pending",
      rawResponse: response,
    });

    order.paymentStatus = "Pending";
    await order.save();

    return res.status(201).json({
      message: "STK Push sent",
      payment: getPaymentState(payment),
      expiresAt: new Date(payment.createdAt.getTime() + getPaymentTimeoutMs()),
    });
  } catch (error) {
    console.error("STK PUSH ERROR:", error);
    return res.status(500).json({ message: error.message || "Payment initiation failed. The order has been marked as failed and can be retried." });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    // This call is intentionally authoritative: a customer checking an old
    // prompt cannot be told it is still processing once its five-minute window
    // has elapsed, even if the background expiry interval has not run yet.
    await expireStalePendingPayments();

    const order = await Order.findById(req.params.orderId).select("_id user total paymentStatus status transactionId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (String(order.user) !== String(req.user._id)) return res.status(403).json({ message: "You cannot view this payment" });

    const payment = await Payment.findOne({ order: order._id }).sort({ createdAt: -1 }).lean();

    return res.json({
      order: {
        _id: order._id,
        total: order.total,
        paymentStatus: order.paymentStatus,
        status: order.status,
        transactionId: order.transactionId || null,
      },
      payment: getPaymentState(payment),
    });
  } catch (error) {
    console.error("PAYMENT STATUS ERROR:", error);
    return res.status(500).json({ message: "Unable to load payment status" });
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
        if (order.user) await createNotification({ user: order.user, message: "Your order payment was successful" });
        for (const item of order.books || []) if (item.seller) await createNotification({ user: item.seller, message: "You received a new paid order" });
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
