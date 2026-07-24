import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();
  const { cart } = useCart();

  const [open, setOpen] = useState(false);

  const navStyle = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "hover:text-blue-600 transition";

  const isAdmin = user?.role === "admin";
  const isSeller = user?.role === "seller";

  // Any logged-in user who is not admin or seller
  const isCustomer = user && !isAdmin && !isSeller;

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-5 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          📚 BookHub Kenya
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl dark:text-white"
        >
          ☰
        </button>

        {/* Navigation */}
        <div
          className={`
            ${open ? "flex" : "hidden"}
            md:flex
            flex-col
            md:flex-row
            absolute
            md:static
            top-16
            left-0
            w-full
            md:w-auto
            bg-white
            dark:bg-slate-900
            md:bg-transparent
            p-5
            md:p-0
            gap-5
            items-center
            text-gray-700
            dark:text-gray-200
          `}
        >
          {/* PUBLIC LINKS */}
          <NavLink
            to="/"
            className={navStyle}
            onClick={() => setOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/books"
            className={navStyle}
            onClick={() => setOpen(false)}
          >
            Books
          </NavLink>

          {/* CUSTOMER LINKS */}
          {isCustomer && (
            <>
              <NavLink
                to="/favorites"
                className={navStyle}
                onClick={() => setOpen(false)}
              >
                Favorites
              </NavLink>

              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold flex items-center gap-1"
                    : "hover:text-blue-600 transition flex items-center gap-1"
                }
                onClick={() => setOpen(false)}
              >
                🛒 Cart

                {cart?.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {cart.length}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/orders"
                className={navStyle}
                onClick={() => setOpen(false)}
              >
                My Orders
              </NavLink>
            </>
          )}

          {/* SELLER LINKS */}
          {isSeller && (
            <>
              <NavLink
                to="/seller/dashboard"
                className={navStyle}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/seller/books"
                className={navStyle}
                onClick={() => setOpen(false)}
              >
                My Books
              </NavLink>

              <NavLink
                to="/seller/add-book"
                className={navStyle}
                onClick={() => setOpen(false)}
              >
                Add Book
              </NavLink>

              <NavLink
                to="/seller/orders"
                className={navStyle}
                onClick={() => setOpen(false)}
              >
                Sales
              </NavLink>
            </>
          )}

          {/* ADMIN LINKS */}
          {isAdmin && (
            <>
              <NavLink
                to="/admin/dashboard"
                className={navStyle}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/users"
                className={navStyle}
                onClick={() => setOpen(false)}
              >
                Users
              </NavLink>

              <NavLink
                to="/admin/books"
                className={navStyle}
                onClick={() => setOpen(false)}
              >
                Books
              </NavLink>

              <NavLink
                to="/admin/orders"
                className={navStyle}
                onClick={() => setOpen(false)}
              >
                Orders
              </NavLink>

              <NavLink
                to="/admin/sellers"
                className={navStyle}
                onClick={() => setOpen(false)}
              >
                Sellers
              </NavLink>
            </>
          )}

          {/* GUEST LINKS */}
          {!user && (
            <>
              <NavLink
                to="/login"
                className={navStyle}
                onClick={() => setOpen(false)}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={navStyle}
                onClick={() => setOpen(false)}
              >
                Register
              </NavLink>

              <Link
                to="/seller/register"
                onClick={() => setOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Become a Seller
              </Link>
            </>
          )}

          {/* LOGGED-IN USER */}
          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden md:block text-sm">
                Hi, {user?.name}
              </span>

              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          )}

          {/* THEME TOGGLE */}
          <button
            onClick={() => setDark(!dark)}
            className="text-xl hover:scale-110 transition"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}