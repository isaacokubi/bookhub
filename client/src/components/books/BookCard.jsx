import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 800'%3E%3Crect width='600' height='800' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='48%25' dominant-baseline='middle' text-anchor='middle' fill='%2364758b' font-family='Arial' font-size='30'%3ENo cover image%3C/text%3E%3C/svg%3E";

const getImageUrl = (image) => {
  if (!image) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(image)) return image;
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return `${base.replace(/\/api\/?$/, "")}${image.startsWith("/") ? image : `/${image}`}`;
};

const sellerName = (seller) =>
  seller?.name || seller?.sellerName || seller?.businessName || seller?.storeName || "BookHub seller";

const categoryName = (category) =>
  typeof category === "string" ? category : category?.name;

export default function BookCard({ book }) {
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();
  const isInCart = cart?.books?.some((item) => item.book?._id === book._id);
  const image = book.images?.[0] || book.image;
  const seller = sellerName(book.seller);
  const category = categoryName(book.category);
  const sellerId = book.seller?._id || book.seller?.id || book.sellerId;
  const price = Number(book.price || 0);

  const handleAddToCart = async () => {
    if (isInCart) return toast.info(`${book.title} is already in your cart 🛒`);
    try {
      await addToCart(book._id);
      toast.success(`${book.title} added to cart 🛒`);
    } catch {
      toast.error("Failed to add book to cart");
    }
  };

  const handleBuyNow = async () => {
    try {
      if (!isInCart) await addToCart(book._id);
      toast.success("Book added. Proceeding to checkout 💳");
      navigate("/checkout");
    } catch {
      toast.error("Unable to proceed to checkout");
    }
  };

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <Link
        to={`/books/${book._id}`}
        className="relative block aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800"
        aria-label={`View ${book.title}`}
      >
        <img
          src={getImageUrl(image)}
          alt={`${book.title} cover`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-[1.03]"
          onError={(event) => {
            if (event.currentTarget.src !== FALLBACK_IMAGE) event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          {book.condition ? (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur dark:bg-slate-950/90 dark:text-slate-200">
              {book.condition}
            </span>
          ) : <span />}
          {book.featured && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 shadow-sm dark:bg-amber-950 dark:text-amber-200">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="min-h-[76px]">
          <Link
            to={`/books/${book._id}`}
            className="line-clamp-2 text-lg font-black leading-6 text-slate-900 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
          >
            {book.title}
          </Link>
          <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
            {book.author || "Unknown author"}
          </p>
        </div>

        <div className="mt-3 min-h-[42px] space-y-1 text-xs text-slate-500 dark:text-slate-400">
          {category && (
            <p className="truncate">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Category:</span> {category}
            </p>
          )}
          <p className="truncate">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Seller:</span>{" "}
            {sellerId ? (
              <Link
                to={`/sellers/${sellerId}`}
                onClick={(event) => event.stopPropagation()}
                className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                {seller}
              </Link>
            ) : seller}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <span className="text-xl font-black tracking-tight text-blue-700 dark:text-blue-400">
            KES {price.toLocaleString("en-KE")}
          </span>
          <Link
            to={`/books/${book._id}`}
            className="shrink-0 text-sm font-bold text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
          >
            Details <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isInCart ? "Added ✓" : "Add to cart"}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            Buy now
          </button>
        </div>
      </div>
    </article>
  );
}
