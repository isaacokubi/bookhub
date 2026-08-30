import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSellers } from "../api/sellerApi";

const getSellerName = (seller) => {
  const name = seller?.name || seller?.sellerName || seller?.storeName || seller?.businessName;
  return String(name || "BookHub Seller").trim() || "BookHub Seller";
};

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
        const { data } = await getSellers(
          search.trim() ? { search: search.trim() } : {},
        );
        const results = Array.isArray(data)
          ? data
          : Array.isArray(data?.sellers)
            ? data.sellers
            : [];
        setSellers(results);
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
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Seller marketplace
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Shop from a seller
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Find a particular seller, open their storefront, and browse only the
            books they currently have for sale.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <label
            htmlFor="seller-search"
            className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            Search sellers
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
              🔎
            </span>
            <input
              id="seller-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by seller name or email..."
              autoComplete="off"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800 dark:focus:ring-blue-950"
            />
          </div>
        </section>

        {loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <p className="font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => setSearch((value) => value)}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        ) : sellers.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="text-5xl" aria-hidden="true">🏪</div>
            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              No sellers found
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Try a different seller name or clear your search.
            </p>
          </div>
        ) : (
          <section aria-label="BookHub sellers" className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {sellers.length} {sellers.length === 1 ? "seller" : "sellers"} available
              </p>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Clear search
                </button>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sellers.map((seller) => {
                const name = getSellerName(seller);
                const bookCount = Number(seller?.bookCount) || 0;
                const hasRating = Number(seller?.rating?.count) > 0;
                const rating = Number(seller?.rating?.average);

                return (
                  <Link
                    key={seller._id}
                    to={`/sellers/${seller._id}`}
                    aria-label={`Visit ${name}'s store`}
                    className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-offset-slate-950"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        {seller?.avatar ? (
                          <img
                            src={seller.avatar}
                            alt={`${name} profile`}
                            className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                              event.currentTarget.nextElementSibling?.classList.remove("hidden");
                            }}
                          />
                        ) : null}

                        <div
                          className={`${seller?.avatar ? "hidden" : ""} flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl dark:bg-blue-950`}
                          aria-hidden="true"
                        >
                          🏪
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Seller
                          </p>
                          <h2 className="break-words text-lg font-extrabold leading-tight text-slate-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                            {name}
                          </h2>
                          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                            {bookCount} {bookCount === 1 ? "book" : "books"} for sale
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                          {hasRating && Number.isFinite(rating)
                            ? `${rating.toFixed(1)} ★`
                            : "New seller"}
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          Visit store <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
