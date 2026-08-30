import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const fallbackImage = "https://via.placeholder.com/240x320?text=BookHub";

const money = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const getBook = (item) => item?.book || item || null;
const getId = (item) => item?._id || item?.id || item?.book?._id || item?.book?.id;
const getPrice = (item) => {
  const book = getBook(item);
  return Number(item?.price ?? item?.unitPrice ?? book?.price ?? 0) || 0;
};

const getImage = (book) => {
  const images = Array.isArray(book?.images) ? book.images : [];
  return images[0]?.url || images[0] || book?.coverImage || book?.imageUrl || book?.image || fallbackImage;
};

export default function Cart() {
  const { cart, removeFromCart, loading } = useCart();
  const cartItems = Array.isArray(cart?.books) ? cart.books : [];

  const validItems = cartItems.filter((item) => getBook(item));
  const totalQuantity = validItems.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0);
  const total = validItems.reduce(
    (sum, item) => sum + getPrice(item) * (Number(item?.quantity) || 1),
    0
  );

  const handleRemove = async (id) => {
    if (!id) return;
    try {
      await removeFromCart(id);
      toast.success("Book removed from your cart");
    } catch {
      toast.error("Could not remove this book. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-10 w-64 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="h-40 rounded-2xl bg-white dark:bg-slate-900" />
            <div className="h-72 rounded-2xl bg-white dark:bg-slate-900" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">BookHub Kenya</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">Your shopping cart</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Review your books, quantities and prices before checkout.
          </p>
        </div>

        {validItems.length === 0 ? (
          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-3xl dark:bg-blue-950/40">🛒</div>
            <h2 className="mt-6 text-2xl font-black text-slate-950 dark:text-white">Your cart is empty</h2>
            <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">
              Discover great reads from trusted sellers across Kenya and add them to your cart.
            </p>
            <Link to="/books" className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
              Browse books
            </Link>
          </section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-4">
              {validItems.map((item, index) => {
                const book = getBook(item);
                const id = getId(item);
                const quantity = Number(item?.quantity) || 1;
                const price = getPrice(item);

                return (
                  <article key={`${id || book.title}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex gap-4 p-4 sm:gap-6 sm:p-5">
                      <Link to={id ? `/books/${id}` : "/books"} className="h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:h-40 sm:w-28">
                        <img src={getImage(book)} alt={`${book.title || "Book"} cover`} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = fallbackImage; }} />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link to={id ? `/books/${id}` : "/books"} className="line-clamp-2 text-lg font-black text-slate-950 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 sm:text-xl">
                              {book.title || "Untitled book"}
                            </Link>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{book.author || "Unknown author"}</p>
                          </div>
                          <button type="button" onClick={() => handleRemove(id)} className="shrink-0 rounded-lg px-2 py-1 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" aria-label={`Remove ${book.title || "book"}`}>
                            Remove
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Unit price</p>
                            <p className="mt-1 text-xl font-black text-blue-600 dark:text-blue-400">{money(price)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Quantity</p>
                            <p className="mt-1 font-bold text-slate-700 dark:text-slate-200">{quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Item total</p>
                            <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{money(price * quantity)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Order summary</h2>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4 text-slate-600 dark:text-slate-400"><span>Items</span><span className="font-bold text-slate-900 dark:text-white">{totalQuantity}</span></div>
                <div className="flex justify-between gap-4 text-slate-600 dark:text-slate-400"><span>Subtotal</span><span className="font-bold text-slate-900 dark:text-white">{money(total)}</span></div>
              </div>
              <div className="my-6 border-t border-slate-100 dark:border-slate-800" />
              <div className="flex items-end justify-between gap-4">
                <span className="font-bold text-slate-600 dark:text-slate-400">Total</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{money(total)}</span>
              </div>
              <Link to="/checkout" className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                Proceed to checkout
              </Link>
              <Link to="/books" className="mt-3 flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                Continue shopping
              </Link>
              <div className="mt-6 space-y-2 text-center text-xs text-slate-500 dark:text-slate-400">
                <p>🔒 Secure checkout</p><p>🇰🇪 Kenyan marketplace</p><p>🏪 Trusted sellers</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
