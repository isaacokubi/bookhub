import { useEffect, useState } from "react";
import { getBooks } from "../../api/bookApi";
import BookCard from "../../components/BookCard";

export default function Books() {
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getBooks();

        console.log("Books API Response:", res.data);

        setBooks(res.data.books || res.data || []);
      } catch (error) {
        console.log("Status:", error.response?.status);

        console.log("Backend Error:", error.response?.data);

        console.log("Loading books failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <p className="p-5 text-lg">Loading books...</p>;
  }

  return (
    <div className="p-5">
      <h1
        className="
        text-3xl
        font-bold
        mb-5
        "
      >
        All Books
      </h1>

      {books.length === 0 ? (
        <p className="text-gray-600">No books available yet.</p>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
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
