import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const money = (value) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(Number(value) || 0);

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/orders/my-orders")
      .then(({ data }) => { if (active) setOrders(Array.isArray(data) ? data : data?.orders || []); })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Unable to load your orders."); })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => ({
    total: orders.length,
    paid: orders.filter((o) => String(o.paymentStatus).toLowerCase() === "paid").length,
    processing: orders.filter((o) => ["processing", "pending"].includes(String(o.status).toLowerCase())).length,
    spent: orders.filter((o) => String(o.paymentStatus).toLowerCase() === "paid").reduce((sum, o) => sum + Number(o.total || 0), 0),
  }), [orders]);

  return <main className="min-h-[75vh] bg-slate-50 dark:bg-slate-950"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl sm:p-8"><p className="text-sm font-semibold text-blue-300">Customer dashboard</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Welcome back, {user?.name || "Reader"}</h1><p className="mt-2 max-w-2xl text-slate-300">Track purchases, discover books and keep your BookHub account organized.</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/books" className="rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500">Browse books</Link><Link to="/orders" className="rounded-xl border border-white/20 px-5 py-3 font-bold hover:bg-white/10">View all orders</Link></div></div>
    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Orders",stats.total],["Paid orders",stats.paid],["In progress",stats.processing],["Total spent",money(stats.spent)]].map(([label,value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p></div>)}</section>
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800"><div><h2 className="text-xl font-black text-slate-950 dark:text-white">Recent orders</h2><p className="text-sm text-slate-500">Your latest purchases</p></div><Link to="/orders" className="text-sm font-bold text-blue-600">See all</Link></div>{loading ? <p className="p-6 text-slate-500">Loading orders…</p> : error ? <p className="p-6 text-red-600">{error}</p> : orders.length === 0 ? <div className="p-8 text-center"><p className="font-bold text-slate-900 dark:text-white">No orders yet</p><Link to="/books" className="mt-3 inline-block font-bold text-blue-600">Start shopping</Link></div> : <div className="divide-y divide-slate-100 dark:divide-slate-800">{orders.slice(0, 6).map((order) => <div key={order._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-slate-900 dark:text-white">Order #{String(order._id).slice(-6)}</p><p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p></div><div className="flex items-center gap-4"><span className="font-black text-slate-900 dark:text-white">{money(order.total)}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-slate-800">{order.status || "Processing"}</span></div></div>)}</div>}</section>
  </div></main>;
}
