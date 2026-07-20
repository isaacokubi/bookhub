import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://bookhub-1-d9b3.onrender.com/api/seller/orders",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders(res.data);
    } catch (error) {
      console.log("Loading seller orders failed:", error);

      toast.error("Failed to load sales orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="
        container
        mx-auto
        py-10
        text-center
        "
      >
        Loading sales orders...
      </div>
    );
  }

  return (
    <div
      className="
      container
      mx-auto
      py-10
      px-5
      "
    >
      <h1
        className="
        text-3xl
        font-bold
        mb-8
        dark:text-white
        "
      >
        Sales Orders
      </h1>

      {orders.length === 0 ? (
        <div
          className="
            bg-gray-100
            rounded-lg
            p-6
            text-center
            "
        >
          <p className="text-gray-600">No sales orders found.</p>
        </div>
      ) : (
        <div
          className="
            space-y-6
            "
        >
          {orders.map((order) => (
            <div
              key={order._id}
              className="
                  bg-white
                  dark:bg-slate-900
                  shadow
                  rounded-xl
                  p-6
                  "
            >
              <h2
                className="
                    text-lg
                    font-bold
                    dark:text-white
                    "
              >
                Order ID:
                <span className="ml-2 text-sm">{order._id}</span>
              </h2>

              <div className="mt-4 space-y-2">
                <p>
                  Buyer:
                  <span className="font-semibold ml-2">
                    {order.user?.name || "Customer"}
                  </span>
                </p>

                <p>
                  Total:
                  <span className="font-bold ml-2">KES {order.total}</span>
                </p>

                <p>
                  Payment:
                  <span
                    className="
                        ml-2
                        text-green-600
                        font-semibold
                        "
                  >
                    {order.paymentStatus}
                  </span>
                </p>

                <p>
                  Order Status:
                  <span className="ml-2">{order.status}</span>
                </p>
              </div>

              <h3
                className="
                    font-semibold
                    mt-6
                    mb-3
                    "
              >
                Books
              </h3>

              {order.books?.map((item, index) => (
                <div
                  key={index}
                  className="
                        border-b
                        py-3
                        "
                >
                  <p className="font-medium">{item.book?.title || "Book"}</p>

                  <p>
                    Price:
                    <span className="ml-2">KES {item.price}</span>
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
