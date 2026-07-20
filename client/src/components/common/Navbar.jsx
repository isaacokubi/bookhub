import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();

  return (
    <nav
      className="
      bg-white dark:bg-slate-900 
      shadow-md
      "
    >
      <div
        className="
        container mx-auto 
        px-5 py-4 
        flex justify-between items-center
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
          BookHub Kenya
        </Link>

        {/* Navigation Links */}
        <div
          className="
          flex 
          gap-5 
          items-center
          text-gray-700
          dark:text-gray-200
          "
        >
          <Link to="/books" className="hover:text-blue-600">
            Books
          </Link>

          <Link to="/favorites" className="hover:text-blue-600">
            Favorites
          </Link>

          <Link to="/cart" className="hover:text-blue-600">
            Cart
          </Link>

          {user && (
            <Link to="/orders" className="hover:text-blue-600">
              Orders
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>

              <Link
                to="/sell"
                className="
                bg-blue-600
                text-white
                px-4
                py-2
                rounded-lg
                hover:bg-blue-700
                "
              >
                Sell Books
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="
              text-red-500
              hover:text-red-700
              "
            >
              Logout
            </button>
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
