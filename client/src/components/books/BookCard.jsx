import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCart } from "../../context/CartContext";

export default function BookCard({ book }) {
  const { cart, addToCart } = useCart();

  const navigate = useNavigate();

  // Check if current book already exists in cart
  const isInCart = cart?.books?.some((item) => item.book?._id === book._id);

  // Add to cart
  const handleAddToCart = async () => {
    if (isInCart) {
      toast.info(`${book.title} is already in your cart 🛒`);

      return;
    }

    try {
      await addToCart(book._id);

      toast.success(`${book.title} added to cart 🛒`);
    } catch (error) {
      toast.error("Failed to add book to cart");
    }
  };

  // Buy now
  const handleBuyNow = async () => {
    try {
      if (!isInCart) {
        await addToCart(book._id);
      }

      toast.success("Book added. Proceeding to checkout 💳");

      navigate("/checkout");
    } catch (error) {
      toast.error("Unable to proceed to checkout");
    }
  };

  return (
    <div
      className="
      border
      rounded
      shadow
      p-4
      bg-white
      dark:bg-slate-900
      "
    >
      {/* Book Image */}

      {book.images && book.images.length > 0 && (
        <img
          src={
            book.images[0].startsWith("http")
              ? book.images[0]
              : `https://bookhub-1-d9b3.onrender.com${book.images[0]}`
          }
          alt={book.title}
          className="
          w-full
          h-56
          object-cover
          rounded
          "
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x500?text=No+Image";
          }}
        />
      )}

      {/* Title */}

      <h2
        className="
        font-bold
        text-xl
        mt-3
        dark:text-white
        "
      >
        {book.title}
      </h2>

      {/* Author */}

      <p className="text-gray-600 dark:text-gray-300">{book.author}</p>

      {/* Category */}

      {book.category && (
        <p className="text-sm text-gray-500">Category: {book.category.name}</p>
      )}

      {/* Seller */}

      {book.seller && (
        <p className="text-sm text-gray-500">Seller: {book.seller.name}</p>
      )}

      {/* Price */}

      <p className="font-semibold text-blue-600 mt-2">KES {book.price}</p>

      {/* Condition */}

      <p>{book.condition}</p>

      {/* Actions */}

      <div
        className="
        flex
        gap-3
        flex-wrap
        mt-4
        "
      >
        <Link
          to={`/books/${book._id}`}
          className="
          border
          px-4
          py-2
          rounded
          hover:bg-gray-100
          "
        >
          View
        </Link>

        <button
          onClick={handleAddToCart}
          className="
          px-4
          py-2
          rounded
          text-white
          bg-blue-600
          hover:bg-blue-700
          "
        >
          {isInCart ? "Added ✓" : "Add To Cart 🛒"}
        </button>

        <button
          onClick={handleBuyNow}
          className="
          bg-green-600
          text-white
          px-4
          py-2
          rounded
          hover:bg-green-700
          "
        >
          Buy Now ⚡
        </button>
      </div>
    </div>
  );
}
