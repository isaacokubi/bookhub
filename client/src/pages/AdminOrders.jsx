import { useEffect, useState } from "react";
import { getOrders } from "../api/adminApi";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();

      setOrders(data);
    } catch (error) {
      console.log("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Loading Orders...</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">Order ID</th>

              <th className="p-3 text-left">Buyer</th>

              <th className="p-3 text-left">Amount</th>

              <th className="p-3 text-left">Status</th>

              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">#{order._id.slice(-6)}</td>

                  <td className="p-3">{order.user?.name || "Unknown"}</td>

                  <td className="p-3">KES {order.total}</td>

                  <td className="p-3 capitalize">{order.status}</td>

                  <td className="p-3">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
