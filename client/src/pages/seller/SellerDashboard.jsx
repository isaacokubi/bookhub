import { Link } from "react-router-dom";

export default function SellerDashboard() {
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
        mb-3
        dark:text-white
        "
      >
        Seller Dashboard
      </h1>

      <p
        className="
        text-gray-600
        mb-8
        "
      >
        Manage your books, sales and orders from here.
      </p>

      <div
        className="
        flex
        gap-4
        flex-wrap
        "
      >
        {/* Add Book */}

        <Link
          to="/seller/add-book"
          className="
          bg-green-600
          hover:bg-green-700
          text-white
          px-5
          py-3
          rounded-lg
          font-semibold
          transition
          "
        >
          Add Book
        </Link>

        {/* My Books */}

        <Link
          to="/seller/books"
          className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-5
          py-3
          rounded-lg
          font-semibold
          transition
          "
        >
          My Books
        </Link>

        {/* Sales Orders */}

        <Link
          to="/seller/orders"
          className="
          bg-purple-600
          hover:bg-purple-700
          text-white
          px-5
          py-3
          rounded-lg
          font-semibold
          transition
          "
        >
          Sales Orders
        </Link>
      </div>

      <div
        className="
        mt-10
        grid
        md:grid-cols-3
        gap-6
        "
      >
        <div
          className="
          bg-white
          dark:bg-slate-900
          shadow
          rounded-xl
          p-6
          "
        >
          <h2 className="font-bold text-xl">Books</h2>

          <p className="text-gray-500 mt-2">
            Add and manage your book listings.
          </p>
        </div>

        <div
          className="
          bg-white
          dark:bg-slate-900
          shadow
          rounded-xl
          p-6
          "
        >
          <h2 className="font-bold text-xl">Orders</h2>

          <p className="text-gray-500 mt-2">View customer purchases.</p>
        </div>

        <div
          className="
          bg-white
          dark:bg-slate-900
          shadow
          rounded-xl
          p-6
          "
        >
          <h2 className="font-bold text-xl">Earnings</h2>

          <p className="text-gray-500 mt-2">Track your sales revenue.</p>
        </div>
      </div>
    </div>
  );
}
