import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../api/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    orders: 0,
    sellers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardStats();

      setStats(data);
    } catch (error) {
      console.error("Dashboard loading failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">Users</h3>

          <p className="text-3xl font-bold">{stats.users}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">Books</h3>

          <p className="text-3xl font-bold">{stats.books}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">Orders</h3>

          <p className="text-3xl font-bold">{stats.orders}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">Sellers</h3>

          <p className="text-3xl font-bold">{stats.sellers}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/admin/books"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Books
        </Link>

        <Link
          to="/admin/orders"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Orders
        </Link>

        <Link
          to="/admin/users"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Users
        </Link>
      </div>
    </div>
  );
}
