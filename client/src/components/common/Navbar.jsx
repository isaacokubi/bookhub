import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const navStyle = ({ isActive }) =>
    isActive
      ? "font-semibold text-blue-600 dark:text-blue-400"
      : "text-slate-700 transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400";

  const role = String(user?.role || "").toLowerCase();
  const isAdmin = role === "admin" || role === "superadmin";
  const isSeller = ["seller", "tour_guide", "tour_manager"].includes(role);
  const canShop = !isAdmin && !isSeller;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={close} className="shrink-0 text-xl font-black tracking-tight text-blue-600 dark:text-blue-400 sm:text-2xl">
          📚 BookHub <span className="hidden sm:inline">Kenya</span>
        </Link>

        <button type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)} className="rounded-lg p-2 text-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden">
          ☰
        </button>

        <div className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-16 flex-col gap-1 border-b border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-950 md:static md:flex md:flex-row md:items-center md:gap-5 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <NavLink to="/" className={navStyle} onClick={close}>Home</NavLink>
          <NavLink to="/books" className={navStyle} onClick={close}>Books</NavLink>
          <NavLink to="/sellers" className={navStyle} onClick={close}>Sellers</NavLink>

          {canShop && (
            <>
              <NavLink to="/favorites" className={navStyle} onClick={close}>Favorites</NavLink>
              <NavLink to="/cart" className={navStyle} onClick={close}>
                <span className="inline-flex items-center gap-1.5">🛒 Cart{cartCount > 0 && <span className="min-w-5 rounded-full bg-blue-600 px-1.5 py-0.5 text-center text-[11px] font-bold text-white">{cartCount}</span>}</span>
              </NavLink>
              {user && <NavLink to="/orders" className={navStyle} onClick={close}>My Orders</NavLink>}
            </>
          )}

          {isSeller && (
            <>
              <NavLink to="/seller/dashboard" className={navStyle} onClick={close}>Dashboard</NavLink>
              <NavLink to="/seller/books" className={navStyle} onClick={close}>My Books</NavLink>
              <NavLink to="/seller/add-book" className={navStyle} onClick={close}>Add Book</NavLink>
              <NavLink to="/seller/orders" className={navStyle} onClick={close}>Sales</NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink to="/admin/dashboard" className={navStyle} onClick={close}>Dashboard</NavLink>
              <NavLink to="/admin/users" className={navStyle} onClick={close}>Users</NavLink>
              <NavLink to="/admin/books" className={navStyle} onClick={close}>Books</NavLink>
              <NavLink to="/admin/orders" className={navStyle} onClick={close}>Orders</NavLink>
              <NavLink to="/admin/sellers" className={navStyle} onClick={close}>Sellers</NavLink>
            </>
          )}

          <div className="flex items-center gap-3 md:ml-auto">
            {!user ? (
              <>
                <NavLink to="/login" className={navStyle} onClick={close}>Login</NavLink>
                <NavLink to="/register" className={navStyle} onClick={close}>Register</NavLink>
                <Link to="/seller/register" onClick={close} className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-sm transition hover:bg-blue-700">Become a Seller</Link>
              </>
            ) : (
              <>
                <span className="hidden text-sm text-slate-500 dark:text-slate-400 lg:block">Hi, {user?.name || user?.email || "there"}</span>
                <button type="button" onClick={() => { logout(); close(); }} className="font-semibold text-red-500 hover:text-red-700">Logout</button>
              </>
            )}
            <button type="button" aria-label="Toggle theme" onClick={() => setDark(!dark)} className="rounded-lg p-2 text-lg transition hover:bg-slate-100 dark:hover:bg-slate-800">{dark ? "☀️" : "🌙"}</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
