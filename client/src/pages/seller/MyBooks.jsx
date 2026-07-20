import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { getSellerBooks, deleteBook } from "../../api/sellerApi";

export default function MyBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await getSellerBooks();

      setBooks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id) => {
    try {
      await deleteBook(id);

      toast.success("Book deleted");

      loadBooks();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      className="
container
mx-auto
py-10
"
    >
      <h1
        className="
text-3xl
font-bold
mb-6
"
      >
        My Listings
      </h1>

      {books.map((book) => (
        <div
          key={book._id}
          className="
border
p-5
rounded
mb-4
flex
justify-between
"
        >
          <div>
            <h2
              className="
font-bold
text-xl
"
            >
              {book.title}
            </h2>

            <p>KES {book.price}</p>
          </div>

          <button
            onClick={() => remove(book._id)}
            className="
bg-red-600
text-white
px-4
py-2
rounded
"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
