import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const { dark, setDark } = useTheme();

  return (
    <nav
      className="
bg-white
Sell Books
￼🌙
Create Account
￼￼
dark:bg-slate-900
shadow
"
    >
      <div
        className="
container
mx-auto
px-5
py-4
flex
justify-between
items-center
"
      >
        <Link
          to="/"
          className="
text-2xl
font-bold
text-blue-600
"
        >
          BookHub Kenya
        </Link>

        <div
          className="
flex
gap-5
items-center
"
        >
          <Link to="/books">Books</Link>

          <Link to="/cart">Cart</Link>

          {user && <Link to="/orders">Orders</Link>}

          {!user ? (
            <>
              <Link to="/login">Login</Link>

              <Link
                to="/register"
                className="
bg-blue-600
text-white
px-4
py-2
rounded
"
              >
                Sell Books
              </Link>
            </>
          ) : (
            <button onClick={logout}>Logout</button>
          )}

          <button onClick={() => setDark(!dark)}>{dark ? "☀️" : "🌙"}</button>
        </div>
      </div>
    </nav>
  );
}
