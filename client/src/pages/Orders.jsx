import { useEffect, useState } from "react";
import { getOrders } from "../api/orderApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {!orders || orders.length  === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="
              border
              rounded
              p-5
              shadow
              "
            >
              <h2 className="font-bold text-lg">
                Order #{order._id.slice(-6)}
              </h2>

              <p>Total: KES {order.total}</p>

              <p>Status: {order.status}</p>

              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

              <div className="mt-4">
                <h3 className="font-semibold">Books</h3>

                {order.books.map((book, index) => (
                  <div key={`${book._id}-${index}`}>{book.title}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
