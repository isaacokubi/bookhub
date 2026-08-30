import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getBooks } from "../api/bookApi";
import BookCard from "../components/books/BookCard";

const CATEGORIES = ["Fiction", "Self Help", "Programming", "Business", "Biography"];
const CONDITIONS = ["New", "Like New", "Used"];

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    condition: searchParams.get("condition") || "",
  });

  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      condition: searchParams.get("condition") || "",
    });
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getBooks(filters);
        const data = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.books)
            ? response.data.books
            : Array.isArray(response?.data?.data)
              ? response.data.data
              : [];
        setBooks(data);
      } catch (requestError) {
        console.error("Failed loading books:", requestError);
        setBooks([]);
        setError("We couldn't load the marketplace right now. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const next = { ...filters, [name]: value };
    setFilters(next);

    const params = {};
    if (next.search.trim()) params.search = next.search.trim();
    if (next.category) params.category = next.category;
    if (next.condition) params.condition = next.condition;
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setFilters({ search: "", category: "", condition: "" });
    setSearchParams({}, { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 dark:bg-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="font-bold uppercase tracking-widest text-blue-600">BookHub marketplace</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Find your next great read</h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">Search books, compare listings and discover titles from sellers across Kenya.</p>
        </div>

        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
            <label className="sr-only" htmlFor="book-search">Search books</label>
            <input id="book-search" type="text" name="search" value={filters.search} onChange={handleChange} placeholder="Search by title, author or ISBN..." className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800" />
            <label className="sr-only" htmlFor="book-category">Category</label>
            <select id="book-category" name="category" value={filters.category} onChange={handleChange} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800">
              <option value="">All categories</option>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <label className="sr-only" htmlFor="book-condition">Condition</label>
            <select id="book-condition" name="condition" value={filters.condition} onChange={handleChange} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800">
              <option value="">All conditions</option>
              {CONDITIONS.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
            </select>
            <button type="button" onClick={clearFilters} className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Clear</button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-96 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />)}</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"><p>{error}</p><button type="button" onClick={() => setFilters({ ...filters })} className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 font-bold text-white">Try again</button></div>
        ) : books.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900"><div className="text-5xl">📚</div><h2 className="mt-4 text-xl font-bold">No books found</h2><p className="mt-2 text-slate-500 dark:text-slate-400">Try another title, author, category or condition.</p><button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">Clear filters</button></div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between"><p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{books.length} {books.length === 1 ? "book" : "books"} available</p>{filters.category && <p className="text-sm text-slate-500 dark:text-slate-400">Category: <span className="font-bold text-slate-700 dark:text-slate-200">{filters.category}</span></p>}</div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{books.map((book) => <BookCard key={book._id} book={book} />)}</div>
          </>
        )}
      </div>
    </main>
  );
}
