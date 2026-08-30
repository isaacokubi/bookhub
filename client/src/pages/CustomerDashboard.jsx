import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const money = (value) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(Number(value) || 0);

const paymentStyles = {
  Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Failed: "bg-red-50 text-red-700 ring-red-200",
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ stats: {}, orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/customer/dashboard")
      .then(({ data: response }) => active && setData({ stats: response?.stats || {}, orders: response?.orders || [] }))
      .catch((requestError) => active && setError(requestError.response?.data?.message || "Unable to load dashboard."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const stats = data.stats;
  const recent = useMemo(() => data.orders.slice(0, 5), [data.orders]);
  const needsPayment = Number(stats.pendingPayments || 0) + Number(stats.failedPayments || 0);

  if (loading) return <main className="min-h-[75vh] bg-slate-50 px-4 py-12 dark:bg-slate-950"><div className="mx-auto max-w-7xl animate-pulse text-slate-500">Loading your BookHub dashboard…</div></main>;

  return (
    <main className="min-h-[75vh] bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl sm:p-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">BookHub Kenya · Customer area</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Welcome back, {user?.name || "Reader"}</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">Manage your purchases, monitor payments and quickly return to books you want to buy.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/books" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-black hover:bg-blue-700">Browse books</Link>
              <Link to="/favorites" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-black hover:bg-white/10">My favourites</Link>
            </div>
          </div>
        </section>

        {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Orders", stats.orders || 0, "🧾"],
            ["Paid", stats.paidOrders || 0, "✓"],
            ["Pending", stats.pendingPayments || 0, "⏳"],
            ["Failed", stats.failedPayments || 0, "!"],
            ["Total spent", money(stats.spent), "KSh"],
          ].map(([label, value, icon]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">{label}</p><span className="text-sm font-black text-slate-400">{icon}</span></div>
              <p className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
            </div>
          ))}
        </section>

        {needsPayment > 0 && (
          <section className="mt-6 flex flex-col gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div><p className="font-black text-amber-950 dark:text-amber-100">You have {needsPayment} order{needsPayment === 1 ? "" : "s"} that need payment</p><p className="mt-1 text-sm text-amber-800 dark:text-amber-300">Failed payments can be retried, while active M-Pesa prompts can be checked from your orders.</p></div>
            <Link to="/orders" className="shrink-0 rounded-xl bg-amber-600 px-5 py-3 text-center text-sm font-black text-white hover:bg-amber-700">Review payments</Link>
          </section>
        )}

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6"><div><h2 className="text-xl font-black text-slate-950 dark:text-white">Recent orders</h2><p className="mt-1 text-sm text-slate-500">Your latest purchases and payment state.</p></div><Link to="/orders" className="font-black text-blue-600 hover:text-blue-700">View all</Link></div>
          {recent.length === 0 ? <div className="p-10 text-center"><p className="text-4xl">📚</p><p className="mt-3 font-black dark:text-white">No orders yet</p><p className="mt-1 text-sm text-slate-500">Start exploring the BookHub marketplace.</p><Link to="/books" className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white">Browse books</Link></div> : recent.map((order) => (
            <div key={order._id} className="flex flex-col gap-4 border-b border-slate-100 p-5 last:border-0 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div><p className="font-black text-slate-950 dark:text-white">Order #{String(order._id).slice(-6)}</p><p className="mt-1 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</p></div>
              <div className="flex flex-wrap items-center gap-3"><span className="font-black dark:text-white">{money(order.total)}</span><span className={`rounded-full px-3 py-1.5 text-xs font-black ring-1 ${paymentStyles[order.paymentStatus] || paymentStyles.Pending}`}>{order.paymentStatus || "Pending"}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{order.status}</span></div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
