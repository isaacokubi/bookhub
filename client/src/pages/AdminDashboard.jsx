import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../api/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalOrders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardStats();

      console.log("Dashboard stats:", data);

      setStats({
        totalUsers: data.totalUsers || 0,
        totalBooks: data.totalBooks || 0,
        totalOrders: data.totalOrders || 0,
      });
    } catch (error) {
      console.error("Dashboard loading failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[300px]">
        <h1 className="text-2xl font-bold text-gray-700">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Total Users
          </h3>

          <p className="text-4xl font-bold text-blue-600 mt-2">
            {stats.totalUsers}
          </p>
        </div>

        {/* Books */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Total Books
          </h3>

          <p className="text-4xl font-bold text-green-600 mt-2">
            {stats.totalBooks}
          </p>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Total Orders
          </h3>

          <p className="text-4xl font-bold text-purple-600 mt-2">
            {stats.totalOrders}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/books"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Manage Books
          </Link>

          <Link
            to="/admin/orders"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Manage Orders
          </Link>

          <Link
            to="/admin/users"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}