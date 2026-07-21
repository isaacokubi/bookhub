import { useEffect, useState } from "react";
import { getBooks } from "../api/adminApi";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await getBooks();

      setBooks(data);
    } catch (error) {
      console.error("Failed to load books:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Loading Books...</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Books</h1>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">Title</th>

              <th className="p-3 text-left">Author</th>

              <th className="p-3 text-left">Price</th>
            </tr>
          </thead>

          <tbody>
            {books.length > 0 ? (
              books.map((book) => (
                <tr key={book._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{book.title}</td>

                  <td className="p-3">{book.author}</td>

                  <td className="p-3">KES {book.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  No books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
