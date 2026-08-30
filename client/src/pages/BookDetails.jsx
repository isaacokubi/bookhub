import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getBook } from "../api/bookApi";
import { useCart } from "../context/CartContext";
import FavoriteButton from "../components/books/FavoriteButton";

const conditionStyles = {
  New: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800",
  "Like New": "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-800",
  Used: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800",
};

const formatPrice = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function BookDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadBook = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getBook(id);
        const data = res?.data?.data ?? res?.data;
        if (active) setBook(data);
      } catch {
        if (active) setError("We couldn't load this book. It may have been removed or is temporarily unavailable.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadBook();
    return () => { active = false; };
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;
    addToCart(book);
    toast.success("Added to your cart", { position: "top-right", autoClose: 1800 });
  };

  if (loading) {
    return (
      <main className="min-h-[65vh] bg-slate-50 px-5 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-6 h-4 w-48 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="grid gap-10 lg:grid-cols-[minmax(320px,480px)_1fr]">
            <div className="aspect-[3/4] rounded-3xl bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-5 py-4"><div className="h-10 w-3/4 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-10 w-40 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-24 rounded bg-slate-200 dark:bg-slate-800" /></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="min-h-[65vh] bg-slate-50 px-5 py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-slate-800">📚</div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">Book unavailable</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{error || "This listing could not be found."}</p>
          <Link to="/books" className="mt-7 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">Browse books</Link>
        </div>
      </main>
    );
  }

  const image = book.images?.[0] || book.image || "https://via.placeholder.com/700x900?text=BookHub";
  const condition = book.condition || "Used";
  const seller = book.seller?.name || book.sellerName || "BookHub Seller";
  const sellerId = book.seller?._id || book.seller?.id || book.sellerId;

  return (
    <main className="bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/books" className="transition hover:text-blue-600">Books</Link><span>/</span><span className="truncate text-slate-700 dark:text-slate-200">{book.title}</span>
        </nav>

        <section className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[minmax(320px,480px)_1fr]">
          <div className="relative flex min-h-[420px] items-center justify-center bg-slate-100 p-6 dark:bg-slate-950 sm:p-10">
            <img src={image} alt={`${book.title} cover`} className="max-h-[620px] w-full max-w-[430px] rounded-2xl object-contain shadow-xl" loading="eager" onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/700x900?text=BookHub"; }} />
          </div>

          <div className="p-6 sm:p-9 lg:p-12">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${conditionStyles[condition] || conditionStyles.Used}`}>{condition}</span>
                <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">{book.title}</h1>
                <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">by <span className="font-semibold text-slate-800 dark:text-slate-200">{book.author || "Unknown author"}</span></p>
              </div>
              <FavoriteButton book={book} />
            </div>

            <div className="mt-8 border-y border-slate-100 py-7 dark:border-slate-800">
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{formatPrice(book.price)}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {book.category && <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">📖 {book.category}</span>}
                {sellerId ? <Link to={`/sellers/${sellerId}`} className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300">🏪 {seller}</Link> : <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">🏪 {seller}</span>}
              </div>
            </div>

            <div className="mt-7">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">About this book</h2>
              <p className="mt-3 whitespace-pre-line leading-7 text-slate-700 dark:text-slate-300">{book.description || "No description has been provided for this listing."}</p>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={handleAddToCart} className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border-2 border-blue-600 px-5 font-bold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:text-blue-400 dark:hover:bg-blue-950/30">🛒 Add to cart</button>
              <Link to="/checkout" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">Buy now</Link>
            </div>
            <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">Secure checkout • Local sellers • Prices in Kenyan Shillings</p>
          </div>
        </section>
      </div>
    </main>
  );
}
