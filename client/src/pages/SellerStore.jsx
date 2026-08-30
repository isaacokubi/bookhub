import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSellerStore } from "../api/sellerApi";
import BookCard from "../components/books/BookCard";

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

  if (loading) return <main className="min-h-screen bg-slate-50 px-5 py-16 dark:bg-slate-950"><div className="mx-auto max-w-7xl animate-pulse"><div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800" /><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />)}</div></div></main>;

  if (error || !store) return <main className="min-h-screen bg-slate-50 px-5 py-16 text-center dark:bg-slate-950"><div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-10 text-red-700">{error || "Seller not found"}<div><Link to="/sellers" className="mt-5 inline-block font-bold text-blue-600">← Back to sellers</Link></div></div></main>;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 dark:bg-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link to="/sellers" className="font-semibold text-blue-600">← All sellers</Link>
        <section className="mt-5 rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-7 text-white shadow-xl sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {store.avatar ? <img src={store.avatar} alt="" className="h-20 w-20 rounded-full object-cover ring-4 ring-white/20" /> : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-4xl">🏪</div>}
            <div><p className="text-sm font-bold uppercase tracking-widest text-blue-200">BookHub seller</p><h1 className="mt-1 text-3xl font-black sm:text-4xl">{store.name}</h1><p className="mt-2 text-blue-100">{store.bookCount} {store.bookCount === 1 ? "book" : "books"} currently available</p></div>
            <div className="sm:ml-auto rounded-2xl bg-white/10 px-5 py-4 text-center backdrop-blur"><div className="text-lg font-black">{store.rating?.count ? `${Number(store.rating.average).toFixed(1)} ★` : "New"}</div><div className="text-xs text-blue-100">Seller rating</div></div>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black">Books from {store.name}</h2><p className="mt-1 text-slate-500 dark:text-slate-400">You're viewing this seller's approved listings only.</p></div><label className="sr-only" htmlFor="store-search">Search this seller's books</label><input id="store-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this seller's books..." className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 sm:max-w-sm dark:border-slate-800 dark:bg-slate-900" /></div>

        {visibleBooks.length ? <div className="mt-7 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{visibleBooks.map((book) => <BookCard key={book._id} book={book} />)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900"><div className="text-5xl">📚</div><h3 className="mt-4 text-xl font-bold">No matching books</h3><p className="mt-2 text-slate-500 dark:text-slate-400">Try another title or author.</p></div>}
      </div>
    </main>
  );
}
