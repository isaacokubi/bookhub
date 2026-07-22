import { useEffect, useState } from "react";
import { getBooks } from "../api/bookApi";
import BookCard from "../components/books/BookCard";

export default function Books() {
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    condition: "",
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await getBooks(filters);

      console.log("Books:", response.data);

      setBooks(response.data);
    } catch (error) {
      console.log("Failed loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Live search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleChange = (e) => {
    setFilters({
      ...filters,

      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      condition: "",
    });
  };

  return (
    <div className="p-5">
      <h1
        className="
        text-3xl
        font-bold
        mb-6
        "
      >
        Books Marketplace
      </h1>

      {/* Live Search + Filters */}

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-4
        gap-4
        mb-8
        "
      >
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search books..."
          className="
          border
          p-3
          rounded
          "
        />

        <input
          type="text"
          name="category"
          value={filters.category}
          onChange={handleChange}
          placeholder="Filter by category"
          className="
          border
          p-3
          rounded
          "
        />

        <select
          name="condition"
          value={filters.condition}
          onChange={handleChange}
          className="
          border
          p-3
          rounded
          "
        >
          <option value="">All Conditions</option>

          <option value="New">New</option>

          <option value="Used">Used</option>
        </select>

        <button
          onClick={clearFilters}
          className="
          bg-gray-500
          text-white
          rounded
          "
        >
          Clear
        </button>
      </div>

      {loading ? (
        <p>Searching books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-6
          "
        >
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
