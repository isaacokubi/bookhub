import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";


export default function BookCard({ book }) {

  const { cart, addToCart } = useCart();



  const handleAddToCart = () => {

    const alreadyInCart = cart.some(
      (item) => item._id === book._id
    );


    if (alreadyInCart) {

      toast.info(
        "Book is already in your cart 🛒"
      );

      return;

    }


    addToCart(book);


    toast.success(
      `${book.title} added to cart 🛒`
    );

  };



  return (

    <div
      className="
      bg-white
      dark:bg-slate-900
      rounded-xl
      shadow
      overflow-hidden
      hover:shadow-lg
      transition
      "
    >


      <img
        src={
          book.images?.[0] ||
          "https://via.placeholder.com/400"
        }
        alt={book.title}
        className="
        h-56
        w-full
        object-cover
        "
      />



      <div className="p-5">


        <h3
          className="
          font-bold
          text-lg
          dark:text-white
          "
        >
          {book.title}
        </h3>



        <p
          className="
          text-gray-500
          dark:text-gray-400
          "
        >
          {book.author}
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
          gap-3
          mt-5
          "
        >


          <Link

            to={`/books/${book._id}`}

            className="
            border
            px-3
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

            className="
            bg-blue-600
            text-white
            px-3
            py-2
            rounded
            hover:bg-blue-700
            active:scale-95
            transition
            "

          >

            Add to Cart 🛒

          </button>



        </div>


      </div>


    </div>

  );

}