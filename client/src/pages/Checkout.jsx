import { useState } from "react";
import { toast } from "react-toastify";

import { useCart } from "../context/CartContext";

import { initiateMpesa } from "../api/paymentApi";
import { createOrder } from "../api/orderApi";

export default function Checkout() {
  const { cart } = useCart();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | NORMALIZE CART FORMAT
  |--------------------------------------------------------------------------
  */

  const cartItems = Array.isArray(cart)
    ? cart
    : cart?.books || cart?.items || [];



  /*
  |--------------------------------------------------------------------------
  | CALCULATE TOTAL
  |--------------------------------------------------------------------------
  */

  const amount = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(
        item.price ||
        item.book?.price ||
        0
      ) *
      Number(
        item.quantity || 1
      ),
    0
  );



  const pay = async () => {

    if (!phone) {
      toast.error(
        "Enter your M-Pesa phone number"
      );
      return;
    }


    if (cartItems.length === 0) {
      toast.error(
        "Your cart is empty"
      );
      return;
    }



    try {

      setLoading(true);


      /*
      |--------------------------------------------------------------------------
      | DEBUG CART
      |--------------------------------------------------------------------------
      */

      console.log(
        "CURRENT CART:",
        cartItems
      );


      console.log(
        "BOOK IDS SENT:",
        cartItems.map(item => ({
          cartId: item._id,
          bookId:
            item.book?._id ||
            item.book ||
            item.bookId ||
            item._id,
          title:
            item.title ||
            item.book?.title
        }))
      );



      /*
      |--------------------------------------------------------------------------
      | FORMAT PHONE
      |--------------------------------------------------------------------------
      */

      let formattedPhone = phone;


      if (phone.startsWith("07")) {

        formattedPhone =
          "254" +
          phone.substring(1);

      }



      /*
      |--------------------------------------------------------------------------
      | CREATE ORDER
      |--------------------------------------------------------------------------
      */


      const orderResponse = await createOrder({

        books:

          cartItems.map(item => ({

            book:
              item.book?._id ||
              item.book ||
              item.bookId ||
              item._id,


            seller:
              item.seller?._id ||
              item.seller ||
              null,


            quantity:
              Number(
                item.quantity || 1
              ),


            price:
              Number(
                item.price ||
                item.book?.price ||
                0
              )

          })),


        total: amount

      });



      console.log(
        "CREATED ORDER:",
        orderResponse
      );



      const orderId =
        orderResponse._id ||
        orderResponse.data?._id;



      if (!orderId) {

        throw new Error(
          "Order creation failed"
        );

      }



      localStorage.setItem(
        "pendingOrder",
        orderId
      );



      /*
      |--------------------------------------------------------------------------
      | MPESA PAYMENT
      |--------------------------------------------------------------------------
      */


      await initiateMpesa({

        phone:
          formattedPhone,

        amount,

        orderId

      });



      toast.success(
        "M-Pesa prompt sent. Enter your PIN."
      );



    } catch(error) {


      console.error(
        "PAYMENT ERROR:",
        error.response?.data ||
        error.message
      );


      toast.error(
        error.response?.data?.message ||
        "Payment failed"
      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="
      container
      mx-auto
      max-w-xl
      px-5
      py-10
    ">


      <h1 className="
        text-3xl
        font-bold
        mb-6
      ">

        Checkout

      </h1>



      <div className="
        border
        rounded-lg
        shadow
        p-6
      ">


        <h2 className="
          text-xl
          font-bold
          mb-4
        ">

          Order Summary

        </h2>



        <p>

          Number of Books:

          <b>
            {" "}
            {cartItems.length}
          </b>

        </p>



        <div className="mt-4">


          {cartItems.map((item) => (

            <div
              key={
                item.book?._id ||
                item._id
              }
              className="
                flex
                justify-between
                border-b
                py-2
              "
            >

              <span>

                {
                  item.title ||
                  item.book?.title
                }

              </span>


              <span>

                KES{" "}

                {
                  Number(
                    item.price ||
                    item.book?.price ||
                    0
                  )
                }

              </span>


            </div>

          ))}


        </div>



        <p className="
          text-xl
          font-bold
          text-green-600
          mt-5
        ">

          Total:

          {" "}

          KES{" "}

          {amount.toLocaleString()}

        </p>



        <input

          type="text"

          placeholder="07XXXXXXXX"

          value={phone}

          onChange={(e)=>
            setPhone(e.target.value)
          }

          className="
            border
            p-3
            rounded
            w-full
            mt-5
          "

        />



        <button

          onClick={pay}

          disabled={loading}

          className="
            bg-green-600
            text-white
            w-full
            mt-5
            py-3
            rounded-lg
          "

        >

          {
            loading
              ? "Sending STK Push..."
              : "Pay With M-Pesa"
          }


        </button>



      </div>


    </div>

  );

}