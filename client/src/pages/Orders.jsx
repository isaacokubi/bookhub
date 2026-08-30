import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getOrders } from "../api/orderApi";
import { initiateMpesa, checkPayment } from "../api/paymentApi";

const money = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const statusMeta = {
  Paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  Pending: { label: "Payment pending", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  Failed: { label: "Payment failed", className: "bg-red-50 text-red-700 ring-red-200" },
};

const formatPhone = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (/^07\d{8}$/.test(digits) || /^01\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^254[17]\d{8}$/.test(digits)) return digits;
  if (/^[17]\d{8}$/.test(digits)) return `254${digits}`;
  return null;
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [checkingId, setCheckingId] = useState("");

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const summary = useMemo(() => ({
    total: orders.length,
    paid: orders.filter((order) => order.paymentStatus === "Paid").length,
    pending: orders.filter((order) => order.paymentStatus === "Pending").length,
    failed: orders.filter((order) => order.paymentStatus === "Failed").length,
    spent: orders
      .filter((order) => order.paymentStatus === "Paid")
      .reduce((sum, order) => sum + Number(order.total || 0), 0),
  }), [orders]);

  const openPayment = (order) => {
    setSelectedOrder(order);
    setPhone(order.payment?.phone || "");
  };

  const retryPayment = async () => {
    if (!selectedOrder) return;
    const formattedPhone = formatPhone(phone);
    if (!formattedPhone) {
      toast.error("Enter a valid Kenyan M-Pesa number, e.g. 0712345678.");
      return;
    }

    try {
      setPayingId(selectedOrder._id);
      await initiateMpesa({ phone: formattedPhone, orderId: selectedOrder._id });
      toast.success("M-Pesa prompt sent. Enter your PIN on your phone.");
      setSelectedOrder(null);
      await loadOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment could not be started. Please try again.");
      await loadOrders();
    } finally {
      setPayingId("");
    }
  };

  const refreshPaymentStatus = async (orderId) => {
    try {
      setCheckingId(orderId);
      const response = await checkPayment(orderId);
      setOrders((current) => current.map((order) =>
        order._id === orderId
          ? { ...order, ...response.data.order, payment: response.data.payment }
          : order,
      ));
      if (response.data.order.paymentStatus === "Paid") toast.success("Payment confirmed. Your order is now paid.");
      else if (response.data.order.paymentStatus === "Failed") toast.error("This payment was not completed. You can try again.");
      else toast.info("Payment is still being processed. Please complete the M-Pesa prompt.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to check payment status.");
    } finally {
      setCheckingId("");
    }
  };

  if (loading) {
    return <main className="min-h-[70vh] bg-slate-50 px-4 py-12 dark:bg-slate-950"><div className="mx-auto max-w-6xl animate-pulse text-slate-500">Loading your orders…</div></main>;
  }

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">BookHub Kenya</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">My orders</h1>
          <p className="mt-2 max-w-2xl text-slate-300">Track your purchases, payment status and outstanding M-Pesa payments from one place.</p>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Orders", summary.total],
            ["Paid", summary.paid],
            ["Needs payment", summary.pending + summary.failed],
            ["Total spent", money(summary.spent)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
            </div>
          ))}
        </section>

        {orders.length === 0 ? (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="text-5xl">📚</div>
            <h2 className="mt-4 text-2xl font-black dark:text-white">No orders yet</h2>
            <p className="mt-2 text-slate-500">Find your next book and place your first order.</p>
            <Link to="/books" className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700">Browse books</Link>
          </section>
        ) : (
          <div className="mt-6 space-y-5">
            {orders.map((order) => {
              const meta = statusMeta[order.paymentStatus] || statusMeta.Pending;
              const itemCount = (order.books || []).reduce((sum, item) => sum + Number(item.quantity || 1), 0);
              const canPay = order.canPay && order.paymentStatus !== "Paid";
              return (
                <article key={order._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Order #{String(order._id).slice(-6)}</p>
                      <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">{itemCount} {itemCount === 1 ? "book" : "books"} · {money(order.total)}</h2>
                      <p className="mt-1 text-sm text-slate-500">Placed {new Date(order.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-black ring-1 ${meta.className}`}>{meta.label}</span>
                  </div>

                  <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto]">
                    <div className="space-y-3">
                      {(order.books || []).slice(0, 4).map((item, index) => (
                        <div key={`${item.book?._id || item.book || index}`} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
                          <div className="min-w-0"><p className="truncate font-bold dark:text-white">{item.book?.title || "Book"}</p><p className="text-xs text-slate-500">Qty {item.quantity || 1}</p></div>
                          <span className="shrink-0 font-black dark:text-white">{money(Number(item.price || 0) * Number(item.quantity || 1))}</span>
                        </div>
                      ))}
                      {order.payment?.resultDesc && order.paymentStatus !== "Paid" && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{order.payment.resultDesc}</p>}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:max-w-xs lg:justify-end">
                      {order.paymentStatus === "Pending" && (
                        <button type="button" onClick={() => refreshPaymentStatus(order._id)} disabled={checkingId === order._id} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">{checkingId === order._id ? "Checking…" : "Check payment"}</button>
                      )}
                      {canPay && (
                        <button type="button" onClick={() => openPayment(order)} className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-black text-white hover:bg-green-700">{order.paymentStatus === "Failed" ? "Retry payment" : "Complete payment"}</button>
                      )}
                      <Link to="/books" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Continue shopping</Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="payment-dialog-title">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-bold text-blue-600">M-Pesa payment</p><h2 id="payment-dialog-title" className="mt-1 text-2xl font-black dark:text-white">Complete order payment</h2><p className="mt-1 text-sm text-slate-500">Order #{String(selectedOrder._id).slice(-6)} · {money(selectedOrder.total)}</p></div>
              <button type="button" onClick={() => setSelectedOrder(null)} className="rounded-lg px-2 text-2xl text-slate-400 hover:bg-slate-100" aria-label="Close">×</button>
            </div>
            <label htmlFor="retry-phone" className="mt-6 block text-sm font-bold dark:text-slate-200">M-Pesa phone number</label>
            <input id="retry-phone" type="tel" inputMode="numeric" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="0712345678" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <p className="mt-2 text-xs text-slate-500">You will receive an M-Pesa prompt. Enter your PIN to complete the payment.</p>
            <div className="mt-6 flex gap-3"><button type="button" onClick={() => setSelectedOrder(null)} className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-bold dark:border-slate-700 dark:text-slate-200">Cancel</button><button type="button" onClick={retryPayment} disabled={payingId === selectedOrder._id} className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-black text-white disabled:opacity-50">{payingId === selectedOrder._id ? "Sending…" : "Send M-Pesa prompt"}</button></div>
          </div>
        </div>
      )}
    </main>
  );
}
