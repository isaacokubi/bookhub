import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getBook } from "../api/bookApi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useFavorite } from "../context/FavoriteContext";

const conditionStyles = {
  New: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800",
  "Like New": "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-800",
  Used: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800",
};
const fallbackImage = "https://via.placeholder.com/700x900?text=BookHub+Kenya";
const formatPrice = (value) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(Number(value) || 0);

function normalizeBookResponse(response) {
  const payload = response?.data;
  if (!payload) return null;
  const candidates = [payload, payload.data, payload.book, payload.data?.book, payload.result];
  return candidates.find((value) => value && !Array.isArray(value) && typeof value === "object" && (value._id || value.id || value.title)) || null;
}
function getBookImage(book) {
  const images = Array.isArray(book?.images) ? book.images : [];
  return images[0]?.url || images[0] || book?.coverImage || book?.imageUrl || book?.image || fallbackImage;
}

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, authLoading } = useAuth();
  const { addFavorite, removeFavorite, isFavorite, loading: favoritesLoading } = useFavorite();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [favoriteSaving, setFavoriteSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadBook() {
      try {
        if (!id) throw new Error("No book was selected.");
        setLoading(true); setError("");
        const normalized = normalizeBookResponse(await getBook(id));
        if (!normalized) throw new Error("The server returned an invalid book response.");
        if (mounted) setBook(normalized);
      } catch (err) {
        console.error("Failed to load book details:", err);
        if (mounted) { setBook(null); setError(err?.response?.data?.message || err.message || "We couldn't load this book. Please try again."); }
      } finally { if (mounted) setLoading(false); }
    }
    loadBook();
    return () => { mounted = false; };
  }, [id]);

  const handleFavorite = async () => {
    if (authLoading) return;

    if (!user || !localStorage.getItem("token")) {
      toast.info("Please sign in to manage your favorites.");
      navigate("/login", { state: { from: `/books/${id}` } });
      return;
    }

    if (!book || favoriteSaving || favoritesLoading) return;

    const bookId = book._id || book.id;
    if (!bookId) return;

    try {
      setFavoriteSaving(true);
      if (isFavorite(bookId)) {
        await removeFavorite(bookId);
        toast.success("Removed from favorites");
      } else {
        await addFavorite(book);
        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error("Failed to update favorite:", err);
      const message = err?.response?.data?.message || "Could not update your favorites.";
      toast.error(message);
    } finally {
      setFavoriteSaving(false);
    }
  };

  const handleAddToCart = async () => {
    if (!book) return;
    try {
      setAdding(true);
      await addToCart(book);
      toast.success("Book added to your cart");
    } catch (err) {
      console.error("Failed to add book to cart:", err);
      toast.error("Could not add this book to your cart.");
    } finally { setAdding(false); }
  };

  if (loading) return <main className="min-h-[70vh] bg-slate-50 px-4 py-10 dark:bg-slate-950"><div className="mx-auto max-w-6xl animate-pulse"><div className="h-4 w-52 rounded bg-slate-200 dark:bg-slate-800" /><div className="mt-8 grid gap-8 lg:grid-cols-[460px_minmax(0,1fr)]"><div className="aspect-[3/4] rounded-3xl bg-slate-200 dark:bg-slate-800" /><div className="space-y-5"><div className="h-10 w-4/5 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-28 rounded bg-slate-200 dark:bg-slate-800" /></div></div></div></main>;

  if (error || !book) return <main className="min-h-[70vh] bg-slate-50 px-4 py-20 dark:bg-slate-950"><div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-slate-800">📚</div><h1 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">Book unavailable</h1><p className="mt-3 text-slate-600 dark:text-slate-400">{error || "This listing could not be found."}</p><Link to="/books" className="mt-7 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">Browse books</Link></div></main>;

  const bookId = book._id || book.id;
  const title = book.title || "Untitled book";
  const author = book.author || "Unknown author";
  const condition = book.condition || "Used";
  const seller = book.seller?.name || book.seller?.businessName || book.sellerName || "BookHub Seller";
  const sellerId = book.seller?._id || book.seller?.id || book.sellerId;
  const category = typeof book.category === "object" ? book.category?.name || book.category?.title : book.category;
  const description = book.description || "No description has been provided for this listing.";
  const favorited = Boolean(bookId && isFavorite(bookId));

  return <main className="min-h-[70vh] bg-slate-50 dark:bg-slate-950"><div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10"><nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 overflow-hidden text-sm"><Link to="/books" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Books</Link><span className="text-slate-400">/</span><span className="truncate text-slate-500 dark:text-slate-400">{title}</span></nav><section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="grid lg:grid-cols-[460px_minmax(0,1fr)]"><div className="flex min-h-[430px] items-center justify-center bg-slate-100 p-6 dark:bg-slate-950 sm:p-10"><div className="relative flex aspect-[3/4] w-full max-w-[370px] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-slate-900"><img src={getBookImage(book)} alt={`${title} cover`} className="h-full w-full object-contain" loading="eager" onError={(e) => { e.currentTarget.src = fallbackImage; }} /></div></div><div className="p-6 sm:p-9 lg:p-12"><div className="flex items-start justify-between gap-5"><div className="min-w-0"><span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${conditionStyles[condition] || conditionStyles.Used}`}>{condition}</span><h1 className="mt-4 break-words text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">{title}</h1><p className="mt-3 text-lg text-slate-600 dark:text-slate-400">by <span className="font-bold text-slate-800 dark:text-slate-200">{author}</span></p></div><button type="button" aria-label={favorited ? "Remove from favorites" : "Add to favorites"} aria-pressed={favorited} onClick={handleFavorite} disabled={authLoading || favoriteSaving || favoritesLoading} className={`shrink-0 rounded-full border p-3 text-xl shadow-sm transition ${favorited ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/40" : "border-slate-200 hover:border-red-200 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800"} disabled:cursor-not-allowed disabled:opacity-60`}>{favorited ? "♥" : "♡"}</button></div><div className="mt-8 border-y border-slate-100 py-7 dark:border-slate-800"><p className="text-3xl font-black text-blue-600 dark:text-blue-400">{formatPrice(book.price)}</p><div className="mt-5 flex flex-wrap gap-2">{category && <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">📖 {category}</span>}{sellerId ? <Link to={`/sellers/${sellerId}`} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300">🏪 {seller}</Link> : <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">🏪 {seller}</span>}</div></div><div className="mt-7"><h2 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">About this book</h2><p className="mt-3 whitespace-pre-line leading-7 text-slate-700 dark:text-slate-300">{description}</p></div><div className="mt-9 grid gap-3 sm:grid-cols-2"><button type="button" disabled={adding || !bookId} onClick={handleAddToCart} className="min-h-12 rounded-xl border-2 border-blue-600 px-5 font-bold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-blue-400">{adding ? "Adding…" : "🛒 Add to cart"}</button><button type="button" onClick={() => navigate("/checkout", { state: { book } })} className="min-h-12 rounded-xl bg-blue-600 px-5 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">Buy now ⚡</button></div><div className="mt-5 grid gap-2 text-center text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-3"><span>🔒 Secure checkout</span><span>🇰🇪 Kenyan marketplace</span><span>🏪 Trusted sellers</span></div></div></div></section></div></main>;
}
