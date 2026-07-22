import { useEffect, useState } from "react";

import {
  getDashboardStats,
  getUsers,
  getAdminBooks,
  getOrders,
  getSellers,
  deleteUser,
  deleteBook,
  updateOrderStatus,
} from "../api/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    orders: 0,
    sellers: 0,
  });

  const [users, setUsers] = useState([]);

  const [books, setBooks] = useState([]);

  const [orders, setOrders] = useState([]);

  const [sellers, setSellers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboard = await getDashboardStats();

        setStats(dashboard);

        const usersData = await getUsers();

        setUsers(usersData);

        const booksData = await getAdminBooks();

        setBooks(booksData);

        const ordersData = await getOrders();

        setOrders(ordersData);

        const sellersData = await getSellers();

        setSellers(sellersData);
      } catch (error) {
        console.log(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const removeUser = async (id) => {
    await deleteUser(id);

    setUsers(users.filter((user) => user._id !== id));
  };

  const removeBook = async (id) => {
    await deleteBook(id);

    setBooks(books.filter((book) => book._id !== id));
  };

  const changeOrderStatus = async (id, status) => {
    await updateOrderStatus(id, status);

    setOrders(
      orders.map((order) =>
        order._id === id
          ? {
              ...order,
              status,
            }
          : order,
      ),
    );
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="border p-5 rounded shadow">
          Users
          <h2>{stats.users}</h2>
        </div>

        <div className="border p-5 rounded shadow">
          Books
          <h2>{stats.books}</h2>
        </div>

        <div className="border p-5 rounded shadow">
          Orders
          <h2>{stats.orders}</h2>
        </div>

        <div className="border p-5 rounded shadow">
          Sellers
          <h2>{stats.sellers}</h2>
        </div>
      </div>

      <hr className="my-8" />

      <h2 className="text-2xl font-bold">Manage Users</h2>

      {users.map((user) => (
        <div key={user._id} className="border p-3 my-2 flex justify-between">
          <div>
            {user.name}
            <br />

            {user.email}
          </div>

          <button
            onClick={() => removeUser(user._id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}

      <h2 className="text-2xl font-bold mt-8">Manage Books</h2>

      {books.map((book) => (
        <div key={book._id} className="border p-3 my-2 flex justify-between">
          {book.title}

          <button
            onClick={() => removeBook(book._id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}

      <h2 className="text-2xl font-bold mt-8">Manage Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="border p-3 my-2">
          <p>
            Order ID:
            {order._id}
          </p>

          <p>
            Status:
            {order.status}
          </p>

          <select
            value={order.status}
            onChange={(e) => changeOrderStatus(order._id, e.target.value)}
          >
            <option>pending</option>

            <option>paid</option>

            <option>shipped</option>

            <option>completed</option>

            <option>cancelled</option>
          </select>
        </div>
      ))}

      <h2 className="text-2xl font-bold mt-8">Manage Sellers</h2>

      {sellers.map((seller) => (
        <div key={seller._id} className="border p-3 my-2">
          {seller.name}
        </div>
      ))}
    </div>
  );
}
