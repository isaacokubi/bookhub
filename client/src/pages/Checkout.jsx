import { useState } from "react";
import { toast } from "react-toastify";

import { useCart } from "../context/CartContext";

import { initiateMpesa } from "../api/paymentApi";
import { createOrder } from "../api/orderApi";

export default function Checkout() {
  const { cart } = useCart();

  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const amount = cart.reduce(
    (sum, item) => sum + Number(item.price),

    0,
  );

  const pay = async () => {
    if (!phone) {
      toast.error("Enter your M-Pesa phone number");

      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");

      return;
    }

    try {
      setLoading(true);

      // 1. Create order first
      const orderResponse = await createOrder({
        books: cart.map((item) => item._id),

        total: amount,
      });

      const orderId = orderResponse.data._id;

      // 2. Initiate M-Pesa payment
      await initiateMpesa({
        phone,

        amount,

        orderId,
      });

      toast.success("M-Pesa prompt sent. Enter your PIN.");
    } catch (error) {
      console.log(
        "Payment error:",

        error.response?.data || error.message,
      );

      toast.error("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      container
      mx-auto
      max-w-xl
      px-5
      py-10
      "
    >
      <h1
        className="
        text-3xl
        font-bold
        mb-6
        "
      >
        Checkout
      </h1>

      <div
        className="
        border
        rounded-lg
        shadow
        p-6
        "
      >
        <h2
          className="
          text-xl
          font-bold
          mb-4
          "
        >
          Order Summary
        </h2>

        <div className="space-y-2">
          <p>
            Number of Books:
            <b> {cart.length}</b>
          </p>

          <p
            className="
            text-xl
            font-bold
            text-green-600
            "
          >
            Total: KES {amount.toLocaleString()}
          </p>
        </div>

        <input
          type="text"
          placeholder="2547XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="
          border
          p-3
          rounded
          w-full
          mt-5
          "
        />

        <button
          onClick={pay}
          disabled={loading}
          className="
          bg-green-600
          text-white
          w-full
          mt-5
          py-3
          rounded-lg
          hover:bg-green-700
          disabled:opacity-50
          "
        >
          {loading ? "Sending STK Push..." : "Pay With M-Pesa"}
        </button>
      </div>
    </div>
  );
}
