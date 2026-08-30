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
  const navStyle = ({ isActive }) => isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600 transition";
  const isAdmin = user?.role === "admin";
  const isSeller = user?.role === "seller";
  const isCustomer = user && !isAdmin && !isSeller;
  const close = () => setOpen(false);

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-5 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">📚 BookHub Kenya</Link>
        <button type="button" aria-label="Toggle navigation" onClick={() => setOpen(!open)} className="md:hidden text-2xl dark:text-white">☰</button>
        <div className={`${open ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-slate-900 md:bg-transparent p-5 md:p-0 gap-5 items-center text-gray-700 dark:text-gray-200`}>
          <NavLink to="/" className={navStyle} onClick={close}>Home</NavLink>
          <NavLink to="/books" className={navStyle} onClick={close}>Books</NavLink>
          <NavLink to="/sellers" className={navStyle} onClick={close}>Sellers</NavLink>
          {isCustomer && <>
            <NavLink to="/favorites" className={navStyle} onClick={close}>Favorites</NavLink>
            <NavLink to="/cart" className={navStyle} onClick={close}>🛒 Cart {cart?.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{cart.length}</span>}</NavLink>
            <NavLink to="/orders" className={navStyle} onClick={close}>My Orders</NavLink>
          </>}
          {isSeller && <>
            <NavLink to="/seller/dashboard" className={navStyle} onClick={close}>Dashboard</NavLink>
            <NavLink to="/seller/books" className={navStyle} onClick={close}>My Books</NavLink>
            <NavLink to="/seller/add-book" className={navStyle} onClick={close}>Add Book</NavLink>
            <NavLink to="/seller/orders" className={navStyle} onClick={close}>Sales</NavLink>
          </>}
          {isAdmin && <>
            <NavLink to="/admin/dashboard" className={navStyle} onClick={close}>Dashboard</NavLink>
            <NavLink to="/admin/users" className={navStyle} onClick={close}>Users</NavLink>
            <NavLink to="/admin/books" className={navStyle} onClick={close}>Books</NavLink>
            <NavLink to="/admin/orders" className={navStyle} onClick={close}>Orders</NavLink>
            <NavLink to="/admin/sellers" className={navStyle} onClick={close}>Sellers</NavLink>
          </>}
          {!user && <>
            <NavLink to="/login" className={navStyle} onClick={close}>Login</NavLink>
            <NavLink to="/register" className={navStyle} onClick={close}>Register</NavLink>
            <Link to="/seller/register" onClick={close} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Become a Seller</Link>
          </>}
          {user && <div className="flex items-center gap-3"><span className="hidden md:block text-sm">Hi, {user?.name}</span><button type="button" onClick={() => { logout(); close(); }} className="text-red-500 hover:text-red-700 font-medium">Logout</button></div>}
          <button type="button" aria-label="Toggle theme" onClick={() => setDark(!dark)} className="text-xl hover:scale-110 transition">{dark ? "☀️" : "🌙"}</button>
        </div>
      </div>
    </nav>
  );
}
