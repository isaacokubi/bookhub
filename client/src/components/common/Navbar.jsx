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
    isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600";

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md">
      <div
        className="
        container mx-auto 
        px-5 py-4 
        flex 
        justify-between 
        items-center
        "
      >
        {/* Logo */}
        <Link
          to="/"
          className="
          text-2xl
          font-bold
          text-blue-600
          dark:text-blue-400
          "
        >
          📚 BookHub Kenya
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="
          md:hidden
          text-2xl
          dark:text-white
          "
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
          <NavLink to="/books" className={navStyle}>
            Books
          </NavLink>

          <NavLink to="/favorites" className={navStyle}>
            Favorites
          </NavLink>

          <NavLink to="/cart" className={navStyle}>
            Cart
            {cart.length > 0 && (
              <span
                className="
                ml-1
                bg-blue-600
                text-white
                text-xs
                px-2
                py-1
                rounded-full
                "
              >
                {cart.length}
              </span>
            )}
          </NavLink>

          {/* Orders */}
          {user && (
            <NavLink to="/orders" className={navStyle}>
              Orders
            </NavLink>
          )}

          {/* Seller Dashboard */}
          {user?.role === "seller" && (
            <NavLink to="/seller/dashboard" className={navStyle}>
              Seller Dashboard
            </NavLink>
          )}

          {/* Admin Dashboard */}
          {user?.role === "admin" && (
            <NavLink to="/admin/dashboard" className={navStyle}>
              Admin Dashboard
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink to="/login" className={navStyle}>
                Login
              </NavLink>

              <Link
                to="/seller/register"
                className="
                bg-blue-600
                text-white
                px-4
                py-2
                rounded-lg
                hover:bg-blue-700
                "
              >
                Become a Seller
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span
                className="
                hidden
                md:block
                text-sm
                "
              >
                Hi, {user.name}
              </span>

              <button
                onClick={logout}
                className="
                text-red-500
                hover:text-red-700
                "
              >
                Logout
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="
            text-xl
            "
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}
