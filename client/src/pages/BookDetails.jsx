import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import { toast } from "react-toastify";

import { getBook } from "../api/bookApi";

import { useCart } from "../context/CartContext";

import FavoriteButton from "../components/books/FavoriteButton";

export default function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    loadBook();
  }, []);

  const loadBook = async () => {
    try {
      const res = await getBook(id);

      setBook(res.data);
    } catch {
      setBook(null);
    }
  };

  const handleAddToCart = () => {
    addToCart(book);

    toast.success("Book added successfully to cart", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  if (!book) return <div className="p-10">Loading...</div>;

  return (
    <div
      className="
      container
      mx-auto
      px-5
      py-10
      "
    >
      <div
        className="
        grid
        md:grid-cols-2
        gap-10
        "
      >
        <div>
          <img
            src={book.images?.[0] || "https://via.placeholder.com/500"}
            alt={book.title}
            className="
            rounded-xl
            w-full
            "
          />
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <h1
              className="
              text-4xl
              font-bold
              "
            >
              {book.title}
            </h1>

            <FavoriteButton book={book} />
          </div>

          <p className="mt-3">
            Author: {book.author}
          </p>

          <p
            className="
            text-blue-600
            text-2xl
            font-bold
            mt-5
            "
          >
            KES {book.price}
          </p>

          <p className="mt-5">
            {book.description}
          </p>

          <p className="mt-4">
            Condition: {book.condition}
          </p>

          <div
            className="
            flex
            gap-4
            mt-8
            "
          >
            <button
              onClick={handleAddToCart}
              className="
              bg-blue-600
              text-white
              px-6
              py-3
              rounded
              hover:bg-blue-700
              transition
              "
            >
              Add To Cart
            </button>

            <Link
              to="/checkout"
              className="
              border
              px-6
              py-3
              rounded
              "
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}