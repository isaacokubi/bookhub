import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getBooks } from "../api/bookApi";
import BookCard from "../components/books/BookCard";

const CATEGORIES = ["Fiction", "Self Help", "Programming", "Business", "Biography"];
const CONDITIONS = ["New", "Like New", "Used"];
const SORT_OPTIONS = [
  ["", "Recommended"],
  ["newest", "Newest listings"],
  ["lowest", "Price: low to high"],
  ["highest", "Price: high to low"],
];

const getInitialFilters = (params) => ({
  search: params.get("search") || "",
  category: params.get("category") || "",
  condition: params.get("condition") || "",
  sort: params.get("sort") || "",
});

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => getInitialFilters(searchParams));
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  // Keep the UI synchronized when a user navigates with browser back/forward
  // or opens a filtered marketplace URL directly.
  useEffect(() => {
    setFilters(getInitialFilters(searchParams));
  }, [searchParams]);

  // Search as the user types. A short debounce prevents an API request for
  // every single keystroke while still making the marketplace feel live.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextParams = {};
      const search = filters.search.trim();
      if (search) nextParams.search = search;
      if (filters.category) nextParams.category = filters.category;
      if (filters.condition) nextParams.condition = filters.condition;
      if (filters.sort) nextParams.sort = filters.sort;

      const current = searchParams.toString();
      const next = new URLSearchParams(nextParams).toString();
      if (current !== next) {
        setSearchParams(nextParams, { replace: true });
      }
    }, filters.search === searchParams.get("search") ? 0 : 300);

    return () => window.clearTimeout(timer);
  }, [filters.search, filters.category, filters.condition, filters.sort, searchParams, setSearchParams]);

  useEffect(() => {
    let active = true;

    const loadBooks = async () => {
      try {
        setLoading(true);
        setSearching(Boolean(filters.search.trim()));
        setError("");

        const response = await getBooks({
          search: filters.search.trim() || undefined,
          category: filters.category || undefined,
          condition: filters.condition || undefined,
          sort: filters.sort || undefined,
        });

        const payload = response?.data;
        const data = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.books)
            ? payload.books
            : Array.isArray(payload?.data)
              ? payload.data
              : [];

        if (active) setBooks(data);
      } catch (requestError) {
        console.error("Failed loading books:", requestError);
        if (active) {
          setBooks([]);
          setError("We couldn't load the marketplace right now. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
          setSearching(false);
        }
      }
    };

    loadBooks();
    return () => {
      active = false;
    };
  }, [filters.search, filters.category, filters.condition, filters.sort]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", category: "", condition: "", sort: "" });
    setSearchParams({}, { replace: true });
  };

  const activeFilterCount = useMemo(
    () => [filters.search.trim(), filters.category, filters.condition, filters.sort].filter(Boolean).length,
    [filters],
  );

  const activeSearch = filters.search.trim();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              🇰🇪 BookHub marketplace
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Find your next great read
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Search thousands of listings from sellers across Kenya. Compare condition, price and seller before you buy.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex flex-col gap-3 lg:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Search books</span>
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">⌕</span>
                <input
                  id="book-search"
                  type="search"
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                  placeholder="Search by title, author or ISBN..."
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-600 dark:bg-slate-900"
                />
                {searching && (
                  <span className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" aria-label="Searching" />
                )}
              </label>
              <div className="flex h-12 items-center rounded-xl bg-blue-50 px-4 text-sm font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 lg:min-w-32 lg:justify-center">
                Live search
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <select name="category" value={filters.category} onChange={handleChange} aria-label="Category" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900">
                <option value="">All categories</option>
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <select name="condition" value={filters.condition} onChange={handleChange} aria-label="Condition" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900">
                <option value="">All conditions</option>
                {CONDITIONS.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
              </select>
              <select name="sort" value={filters.sort} onChange={handleChange} aria-label="Sort books" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900">
                {SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Marketplace</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">Books available</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {loading ? "Finding listings..." : `${books.length} ${books.length === 1 ? "listing" : "listings"} found`}
              {activeSearch ? ` for “${activeSearch}”` : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button type="button" onClick={clearFilters} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-white hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-900">
                Clear filters
              </button>
            )}
            <Link to="/sellers" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              Shop by seller
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <div key={item} className="h-[470px] animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />)}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/30">
            <div className="text-4xl">⚠️</div>
            <h2 className="mt-3 text-xl font-bold">Marketplace unavailable</h2>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
            <button type="button" onClick={() => setFilters((current) => ({ ...current }))} className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 font-bold text-white hover:bg-red-700">Try again</button>
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="text-5xl">📚</div>
            <h2 className="mt-4 text-xl font-black">No books found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">Try a different title, author, ISBN, category or condition.</p>
            <button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => <BookCard key={book._id} book={book} />)}
          </div>
        )}
      </section>
    </main>
  );
}
