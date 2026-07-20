import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  return (
    <div
      className="
      container
      mx-auto
      py-10
      px-5
      "
    >
      <div
        className="
        bg-slate-900
        text-white
        rounded-xl
        p-8
        mb-8
        "
      >
        <h1
          className="
          text-3xl
          font-bold
          "
        >
          Admin Dashboard
        </h1>

        <p
          className="
          mt-3
          text-gray-300
          "
        >
          Manage BookHub users, sellers, books and orders.
        </p>
      </div>

      <div
        className="
        grid
        md:grid-cols-2
        lg:grid-cols-4
        gap-6
        "
      >
        <Link
          to="/admin/users"
          className="
          bg-blue-600
          text-white
          rounded-xl
          p-6
          hover:bg-blue-700
          "
        >
          <h2
            className="
            text-xl
            font-bold
            "
          >
            Users
          </h2>

          <p className="mt-2">Manage customers</p>
        </Link>

        <Link
          to="/admin/sellers"
          className="
          bg-green-600
          text-white
          rounded-xl
          p-6
          hover:bg-green-700
          "
        >
          <h2
            className="
            text-xl
            font-bold
            "
          >
            Sellers
          </h2>

          <p className="mt-2">Approve and manage sellers</p>
        </Link>

        <Link
          to="/admin/orders"
          className="
          bg-purple-600
          text-white
          rounded-xl
          p-6
          hover:bg-purple-700
          "
        >
          <h2
            className="
            text-xl
            font-bold
            "
          >
            Orders
          </h2>

          <p className="mt-2">Monitor payments and escrow</p>
        </Link>

        <Link
          to="/admin/books"
          className="
          bg-orange-600
          text-white
          rounded-xl
          p-6
          hover:bg-orange-700
          "
        >
          <h2
            className="
            text-xl
            font-bold
            "
          >
            Books
          </h2>

          <p className="mt-2">Manage listings</p>
        </Link>
      </div>

      <div
        className="
        mt-10
        flex
        gap-4
        flex-wrap
        "
      >
        <Link
          to="/admin/announcements"
          className="
          bg-indigo-600
          text-white
          px-5
          py-3
          rounded-lg
          "
        >
          Announcements
        </Link>

        <button
          onClick={logout}
          className="
          bg-red-600
          text-white
          px-5
          py-3
          rounded-lg
          "
        >
          Logout
        </button>
      </div>
    </div>
  );
}
