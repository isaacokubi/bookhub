import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSellerStore } from "../api/sellerApi";
import BookCard from "../components/books/BookCard";

const getSellerName = (seller) => {
  const name = seller?.name || seller?.sellerName || seller?.storeName || seller?.businessName;
  return String(name || "BookHub Seller").trim() || "BookHub Seller";
};

export default function SellerStore() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await getSellerStore(id);
        if (active) {
          setStore(data?.seller || null);
          setBooks(Array.isArray(data?.books) ? data.books : []);
        }
      } catch (requestError) {
        console.error("Failed loading seller storefront:", requestError);
        if (active) setError(requestError.response?.data?.message || "Unable to load this seller.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  const visibleBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return books;
    return books.filter((book) => `${book.title || ""} ${book.author || ""}`.toLowerCase().includes(query));
  }, [books, search]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-16 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />)}
          </div>
        </div>
      </main>
    );
  }

  if (error || !store) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-16 text-slate-900 dark:bg-slate-950 dark:text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <p className="font-semibold">{error || "Seller not found"}</p>
          <Link to="/sellers" className="mt-5 inline-block font-bold text-blue-600 dark:text-blue-400">← Back to sellers</Link>
        </div>
      </main>
    );
  }

  const name = getSellerName(store);
  const bookCount = Number(store.bookCount) || books.length;
  const hasRating = Number(store?.rating?.count) > 0;
  const rating = Number(store?.rating?.average);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/sellers" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          ← All sellers
        </Link>

        <section className="mt-5 rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-7 text-white shadow-xl sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {store.avatar ? (
              <img src={store.avatar} alt={`${name} profile`} className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-white/20" />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/10 text-4xl" aria-hidden="true">🏪</div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-200">BookHub seller</p>
              <h1 className="mt-1 break-words text-3xl font-black text-white sm:text-4xl">{name}</h1>
              <p className="mt-2 text-blue-100">
                {bookCount} {bookCount === 1 ? "book" : "books"} currently available
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-4 text-center backdrop-blur sm:ml-auto">
              <div className="text-lg font-black text-white">
                {hasRating && Number.isFinite(rating) ? `${rating.toFixed(1)} ★` : "New"}
              </div>
              <div className="text-xs text-blue-100">Seller rating</div>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Books from {name}</h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">You're viewing this seller's approved listings only.</p>
          </div>
          <div className="w-full sm:max-w-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="store-search">
              Search this seller's books
            </label>
            <input
              id="store-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title or author..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-950"
            />
          </div>
        </div>

        {visibleBooks.length ? (
          <div className="mt-7 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visibleBooks.map((book) => <BookCard key={book._id} book={book} />)}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="text-5xl" aria-hidden="true">📚</div>
            <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No matching books</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Try another title or author.</p>
          </div>
        )}
      </div>
    </main>
  );
}
