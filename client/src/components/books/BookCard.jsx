import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCart } from "../../context/CartContext";

export default function BookCard({ book }) {
  const { cart, addToCart } = useCart();

  const navigate = useNavigate();

  const isInCart = cart.some((item) => item._id === book._id);

  const handleAddToCart = () => {
    if (isInCart) {
      toast.info(`${book.title} is already in your cart 🛒`);

      return;
    }

    addToCart(book);

    toast.success(`${book.title} added to cart 🛒`);
  };

  const handleBuyNow = () => {
    if (!isInCart) {
      addToCart(book);
    }

    toast.success("Book added. Proceeding to checkout 💳");

    navigate("/checkout");
  };

  return (
    <div
      className="
      bg-white
      dark:bg-slate-900
      rounded-xl
      shadow-md
      overflow-hidden
      hover:shadow-xl
      transition
      "
    >
      <img
        src={
          book.images?.length
            ? book.images[0]
            : "https://via.placeholder.com/400x500?text=No+Image"
        }
        alt={book.title}
        className="
        h-56
        w-full
        object-cover
        "
      />

      <div className="p-5">
        <h2
          className="
          text-xl
          font-bold
          dark:text-white
          "
        >
          {book.title}
        </h2>

        <p
          className="
          text-gray-500
          dark:text-gray-400
          "
        >
          By {book.author}
        </p>

        <p
          className="
          text-blue-600
          font-bold
          mt-3
          "
        >
          KES {book.price}
        </p>

        <div
          className="
          flex
          flex-wrap
          gap-3
          mt-5
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
            dark:border-slate-700
            dark:hover:bg-slate-800
            "
          >
            View
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`
              px-4
              py-2
              rounded
              text-white
              transition

              ${
                isInCart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }

            `}
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
            active:scale-95
            transition
            "
          >
            Buy Now ⚡
          </button>
        </div>
      </div>
    </div>
  );
}
