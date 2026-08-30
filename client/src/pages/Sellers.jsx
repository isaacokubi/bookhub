import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSellers } from "../api/sellerApi";

export default function Sellers() {
  const [search, setSearch] = useState("");
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await getSellers(search.trim() ? { search: search.trim() } : {});
        setSellers(Array.isArray(data) ? data : []);
      } catch (requestError) {
        console.error("Failed loading sellers:", requestError);
        setError("We couldn't load sellers right now. Please try again.");
        setSellers([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 dark:bg-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="font-bold uppercase tracking-widest text-blue-600">Seller marketplace</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">Shop from a seller</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">Find a particular seller, open their storefront and browse only the books they currently have for sale.</p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <label htmlFor="seller-search" className="sr-only">Search sellers</label>
          <input id="seller-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search seller by name or email..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800" />
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map((item) => <div key={item} className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />)}</div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700">{error}</div>
        ) : sellers.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900"><div className="text-5xl">🏪</div><h2 className="mt-4 text-xl font-bold">No sellers found</h2><p className="mt-2 text-slate-500 dark:text-slate-400">Try a different seller name.</p></div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sellers.map((seller) => (
              <Link key={seller._id} to={`/sellers/${seller._id}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-4">
                  {seller.avatar ? <img src={seller.avatar} alt="" className="h-14 w-14 rounded-full object-cover" /> : <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl dark:bg-blue-950">🏪</div>}
                  <div className="min-w-0"><h2 className="truncate text-lg font-bold group-hover:text-blue-600">{seller.name}</h2><p className="text-sm text-slate-500 dark:text-slate-400">{seller.bookCount} {seller.bookCount === 1 ? "book" : "books"} for sale</p></div>
                </div>
                <div className="mt-6 flex items-center justify-between text-sm"><span className="font-semibold text-slate-500">{seller.rating?.count ? `${Number(seller.rating.average).toFixed(1)} ★` : "New seller"}</span><span className="font-bold text-blue-600">Visit store →</span></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
