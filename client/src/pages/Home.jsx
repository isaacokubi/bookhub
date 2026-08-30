import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getBooks } from "../api/bookApi";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const categories = [
  { name: "Fiction", icon: "📖", description: "Stories, novels and timeless page-turners" },
  { name: "Academic", icon: "🎓", description: "Textbooks and study resources" },
  { name: "Business", icon: "💼", description: "Leadership, finance and entrepreneurship" },
  { name: "Children", icon: "🧸", description: "Fun and educational books for young readers" },
];

const benefits = [
  { icon: "🛡️", title: "Shop with confidence", text: "Discover books from sellers through a secure marketplace experience." },
  { icon: "🇰🇪", title: "Built for Kenya", text: "A local marketplace connecting readers and sellers across Kenya." },
  { icon: "🚚", title: "Convenient buying", text: "Find the right book, compare listings and manage your orders in one place." },
];

const imageUrl = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_ORIGIN}/${String(image).replace(/^\/+/, "")}`;
};

export default function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const loadBooks = async () => {
      try {
        setLoading(true);
        const response = await getBooks();
        const data = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.books)
            ? response.data.books
            : Array.isArray(response?.data?.data)
              ? response.data.data
              : [];
        if (active) {
          setBooks(data);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadBooks();
    return () => { active = false; };
  }, []);

  const featuredBooks = useMemo(() => books.slice(0, 4), [books]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/books?search=${encodeURIComponent(query)}` : "/books");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-20" aria-hidden="true"><div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-400 blur-3xl" /><div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-indigo-400 blur-3xl" /></div>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-10 lg:py-28">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">🇰🇪 Kenya's book marketplace</span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Discover books. Share stories. Shop locally.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100 sm:text-xl">Buy great books from trusted sellers or turn your bookshelf into a marketplace. BookHub makes buying and selling books simple across Kenya.</p>
            <form onSubmit={handleSearch} className="mt-9 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-2xl sm:flex-row">
              <label className="sr-only" htmlFor="home-book-search">Search for books</label>
              <input id="home-book-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title, author or keyword..." className="min-w-0 flex-1 rounded-xl border-0 bg-slate-100 px-5 py-3.5 text-slate-900 outline-none ring-blue-500 placeholder:text-slate-500 focus:ring-2" />
              <button type="submit" className="rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">Search books</button>
            </form>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/books" className="rounded-xl bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-blue-50">Browse marketplace</Link>
              <Link to="/seller/register" className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20">Become a seller</Link>
            </div>
          </div>
          <div className="hidden lg:block"><div className="relative mx-auto max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur"><div className="rounded-[1.5rem] bg-white p-6 text-slate-900"><div className="flex items-center justify-between"><span className="text-sm font-bold text-blue-700">BOOKHUB</span><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Trusted marketplace</span></div><div className="mt-7 grid grid-cols-2 gap-4">{[["📚","Great reads","blue"],["🛍️","Easy checkout","slate"],["⭐","Quality listings","amber"],["🇰🇪","Made for Kenya","emerald"]].map(([icon,text,tone]) => <div key={text} className={`rounded-2xl bg-${tone}-50 p-5`}><div className="text-3xl">{icon}</div><p className="mt-3 font-bold">{text}</p></div>)}</div></div></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-bold uppercase tracking-widest text-blue-600">Explore</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Find books for every reader</h2><p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">Start with a category or search the full marketplace.</p></div><Link to="/books" className="font-bold text-blue-600 hover:text-blue-700">View all books →</Link></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map((category) => <Link key={category.name} to={`/books?category=${encodeURIComponent(category.name)}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl dark:bg-blue-950">{category.icon}</div><h3 className="mt-5 text-lg font-bold">{category.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{category.description}</p><span className="mt-4 inline-block text-sm font-bold text-blue-600 transition group-hover:translate-x-1">Explore →</span></Link>)}</div>
      </section>

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-bold uppercase tracking-widest text-blue-600">Marketplace</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Featured books</h2><p className="mt-3 text-slate-600 dark:text-slate-300">Fresh listings from the BookHub marketplace.</p></div><Link to="/books" className="font-bold text-blue-600 hover:text-blue-700">Browse everything →</Link></div>
        {loading ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />)}</div> : featuredBooks.length > 0 ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featuredBooks.map((book) => <Link key={book._id} to={`/books/${book._id}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"><div className="aspect-[4/5] overflow-hidden bg-slate-200 dark:bg-slate-800">{book.images?.[0] ? <img src={imageUrl(book.images[0])} alt={book.title || "Book"} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <div className="flex h-full items-center justify-center text-6xl">📚</div>}</div><div className="p-5"><p className="line-clamp-2 min-h-12 font-bold">{book.title}</p><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{book.author || "BookHub seller"}</p><p className="mt-4 text-lg font-black text-blue-600">KES {Number(book.price || 0).toLocaleString()}</p></div></Link>)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700"><div className="text-4xl">📚</div><h3 className="mt-3 font-bold">New books are arriving soon</h3><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Be the first to explore new listings on the marketplace.</p><Link to="/seller/register" className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">List a book</Link></div>}
        {error && <p className="mt-4 text-center text-sm text-slate-500">We couldn't load featured listings right now. You can still browse the marketplace.</p>}
      </div></section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10"><div className="grid gap-5 md:grid-cols-3">{benefits.map((benefit) => <div key={benefit.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="text-3xl">{benefit.icon}</div><h3 className="mt-5 text-lg font-bold">{benefit.title}</h3><p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">{benefit.text}</p></div>)}</div></section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10"><div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 px-7 py-12 text-white shadow-xl sm:px-12 lg:flex lg:items-center lg:justify-between"><div className="max-w-2xl"><p className="font-bold uppercase tracking-widest text-blue-200">For sellers</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Turn your books into an opportunity.</h2><p className="mt-4 text-blue-100">Create your seller account, list your books and reach readers looking for their next great read.</p></div><Link to="/seller/register" className="mt-7 inline-flex rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 transition hover:bg-blue-50 lg:mt-0">Start selling today</Link></div></section>
    </main>
  );
}
