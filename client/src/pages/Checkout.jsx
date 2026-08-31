import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useAuth, normalizeRole } from "../context/AuthContext";
import { initiateMpesa } from "../api/paymentApi";
import { createOrder } from "../api/orderApi";

const money = (value) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(Number(value) || 0);
const getBook = (item) => item?.book || item || {};
const getBookId = (item) => item?.book?._id || item?.book || item?.bookId || item?._id;
const getPrice = (item) => Number(item?.price ?? item?.unitPrice ?? item?.book?.price ?? 0) || 0;
const getTitle = (item) => item?.title || item?.book?.title || "Untitled book";
const customerRestrictedRoles = new Set(["admin", "seller"]);

export default function Checkout() {
  const { cart } = useCart();
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const cartItems = useMemo(() => (Array.isArray(cart) ? cart : cart?.books || cart?.items || []), [cart]);
  const { total, quantity } = useMemo(() => cartItems.reduce((result, item) => {
    const qty = Math.max(1, Number(item?.quantity) || 1);
    result.quantity += qty;
    result.total += getPrice(item) * qty;
    return result;
  }, { total: 0, quantity: 0 }), [cartItems]);

  const handlePhoneChange = (event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 12));
  const formatPhone = () => {
    const digits = phone.replace(/\D/g, "");
    if (/^07\d{8}$/.test(digits) || /^01\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
    if (/^254[17]\d{8}$/.test(digits)) return digits;
    if (/^[17]\d{8}$/.test(digits)) return `254${digits}`;
    return null;
  };
  const goToLogin = () => navigate(`/login?redirect=${encodeURIComponent("/checkout")}`);

  const pay = async () => {
    if (authLoading) return;
    if (!user) {
      toast.info("Please log in as a buyer to complete your purchase.");
      goToLogin();
      return;
    }
    const role = normalizeRole(user.role);
    if (customerRestrictedRoles.has(role)) {
      toast.error("Seller and administrator accounts cannot purchase books. Please use a buyer account.");
      return;
    }
    const formattedPhone = formatPhone();
    if (!formattedPhone) return toast.error("Enter a valid Kenyan M-Pesa number, e.g. 0712345678");
    if (!cartItems.length || total <= 0) return toast.error("Your cart is empty or has an invalid total");

    try {
      setLoading(true);
      const orderResponse = await createOrder({
        books: cartItems.map((item) => ({
          book: getBookId(item),
          quantity: Math.max(1, Number(item?.quantity) || 1),
        })),
      });
      const orderId = orderResponse?._id || orderResponse?.data?._id || orderResponse?.data?.data?._id;
      const orderTotal = Number(orderResponse?.total ?? orderResponse?.data?.total ?? orderResponse?.data?.data?.total);
      if (!orderId || !Number.isFinite(orderTotal) || orderTotal <= 0) throw new Error("Order creation failed");

      localStorage.setItem("pendingOrder", orderId);
      await initiateMpesa({ phone: formattedPhone, orderId });
      toast.success("M-Pesa prompt sent. Enter your PIN on your phone.");
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      console.error("PAYMENT ERROR:", error.response?.data || error.message);
      if (status === 401) {
        toast.info("Your session has expired. Please log in again.");
        goToLogin();
      } else if (status === 403) {
        toast.error(message || "You are not authorized to make this payment.");
      } else {
        toast.error(message || "Payment could not be started. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-16 dark:bg-slate-950"><section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="text-5xl">🛒</div><h1 className="mt-5 text-3xl font-black text-slate-950 dark:text-white">Your cart is empty</h1><p className="mt-3 text-slate-600 dark:text-slate-400">Add a book before continuing to checkout.</p><Link to="/books" className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700">Browse books</Link></section></main>
  );

  const isRestrictedAccount = Boolean(user && customerRestrictedRoles.has(normalizeRole(user.role)));
  return (
    <main className="min-h-[70vh] bg-slate-50 dark:bg-slate-950"><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12"><div className="mb-8"><p className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">BookHub Kenya</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">Secure checkout</h1><p className="mt-2 text-slate-600 dark:text-slate-400">Review your order and pay securely with M-Pesa.</p></div>{!user && !authLoading && <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/60 dark:bg-blue-950/30 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-black text-blue-950 dark:text-blue-100">Please log in to complete your purchase</p><p className="mt-1 text-sm text-blue-800 dark:text-blue-300">Your cart is saved. Sign in with your buyer account to continue securely.</p></div><button type="button" onClick={goToLogin} className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700">Log in to continue</button></div>}{isRestrictedAccount && <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/60 dark:bg-amber-950/30"><p className="font-black text-amber-950 dark:text-amber-100">Buyer account required</p><p className="mt-1 text-sm text-amber-800 dark:text-amber-300">Seller and administrator accounts manage the marketplace and cannot place customer purchases.</p></div>}<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"><section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7"><div className="flex items-center justify-between border-b border-slate-100 pb-5 dark:border-slate-800"><h2 className="text-xl font-black text-slate-950 dark:text-white">Order summary</h2><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{quantity} {quantity === 1 ? "book" : "books"}</span></div><div className="divide-y divide-slate-100 dark:divide-slate-800">{cartItems.map((item, index) => { const qty = Math.max(1, Number(item?.quantity) || 1); const price = getPrice(item); const book = getBook(item); return <div key={`${getBookId(item) || getTitle(item)}-${index}`} className="flex items-center justify-between gap-4 py-5"><div className="min-w-0"><p className="truncate font-bold text-slate-900 dark:text-white">{getTitle(item)}</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{book?.author || "Book"} · Qty {qty}</p></div><div className="shrink-0 text-right font-black text-slate-950 dark:text-white">{money(price * qty)}</div></div>; })}</div></section><aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-black text-slate-950 dark:text-white">Payment</h2><div className="mt-5 flex justify-between border-b border-slate-100 pb-5 text-sm dark:border-slate-800"><span className="text-slate-500 dark:text-slate-400">Order total</span><span className="text-2xl font-black text-blue-600 dark:text-blue-400">{money(total)}</span></div><label htmlFor="mpesa-phone" className="mt-6 block text-sm font-bold text-slate-800 dark:text-slate-200">M-Pesa phone number</label><div className="mt-2 flex overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950"><span className="flex items-center border-r border-slate-200 px-3 text-sm font-bold text-slate-500 dark:border-slate-700">+254</span><input id="mpesa-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" value={phone} onChange={handlePhoneChange} placeholder="712345678" aria-describedby="phone-help" className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400 dark:text-white" /></div><p id="phone-help" className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Enter 07XXXXXXXX, 01XXXXXXXX or 254XXXXXXXXX.</p><button type="button" onClick={pay} disabled={loading || authLoading || isRestrictedAccount} className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-green-600 px-5 font-black text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">{authLoading ? "Checking account…" : loading ? "Sending M-Pesa prompt…" : !user ? "Log in to pay" : isRestrictedAccount ? "Buyer account required" : `Pay ${money(total)} with M-Pesa`}</button><div className="mt-5 space-y-2 text-center text-xs text-slate-500 dark:text-slate-400"><p>🔒 Secure payment</p><p>🇰🇪 Kenyan marketplace</p><p>Your M-Pesa PIN is never shared with BookHub</p></div></aside></div></div></main>
  );
}
