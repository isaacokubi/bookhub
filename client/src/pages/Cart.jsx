import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart } = useCart();


  const cartItems = cart?.books || [];



  const handleRemoveFromCart = async (id) => {

    if (!id) return;


    await removeFromCart(id);


    toast.success("Book removed from cart", {
      position: "top-right",
      autoClose: 2000,
    });

  };



  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.book?.price || 0) *
        (item.quantity || 1),
    0
  );



  return (
    <div className="container mx-auto px-5 py-10">


      <h1 className="text-3xl font-bold">
        Shopping Cart
      </h1>



      {cartItems.length === 0 ? (

        <div className="mt-8">

          <p className="text-gray-500">
            Your cart is empty.
          </p>


          <Link
            to="/books"
            className="
              inline-block
              mt-5
              bg-blue-600
              text-white
              px-5
              py-3
              rounded
            "
          >
            Browse Books
          </Link>


        </div>


      ) : (


        <>

          <div className="mt-8">


            {cartItems.map((item, index) => {


              const book = item.book;


              if (!book) return null;



              return (

                <div
                  key={`${book._id}-${index}`}
                  className="
                    border
                    p-4
                    my-3
                    flex
                    justify-between
                    items-center
                    rounded-lg
                    shadow-sm
                  "
                >


                  <div>


                    <h2 className="font-bold text-lg">
                      {book.title}
                    </h2>



                    <p>
                      {book.author}
                    </p>



                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity || 1}
                    </p>


                  </div>




                  <div className="flex items-center gap-5">


                    <span
                      className="
                        font-bold
                        text-blue-600
                      "
                    >
                      KES {book.price}
                    </span>



                    <button

                      onClick={() =>
                        handleRemoveFromCart(book._id)
                      }

                      className="
                        bg-red-600
                        text-white
                        px-4
                        py-2
                        rounded
                        hover:bg-red-700
                      "
                    >
                      Remove
                    </button>



                  </div>


                </div>

              );


            })}


          </div>




          <div
            className="
              mt-8
              border-t
              pt-6
            "
          >



            <div className="mb-4">


              <h2 className="text-xl font-bold">
                Order Summary
              </h2>



              <p>
                Books: {cartItems.length}
              </p>




              <p
                className="
                  text-2xl
                  font-bold
                  text-green-600
                  mt-2
                "
              >
                Total: KES {total}
              </p>



            </div>




            <Link
              to="/checkout"
              className="
                inline-block
                mt-3
                bg-green-600
                text-white
                px-6
                py-3
                rounded-lg
                hover:bg-green-700
                transition
              "
            >
              Proceed to Pay with M-Pesa
            </Link>


          </div>


        </>


      )}


    </div>
  );
}