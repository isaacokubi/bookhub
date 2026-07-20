import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BookDetails from "../pages/BookDetails";
import SellerDashboard from "../pages/SellerDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Books from "../pages/Books";
import Cart from "../pages/Cart";
import Favorites from "../pages/Favorites";
import Orders from "../pages/Orders";
import Checkout from "../pages/Checkout";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/books/:id" element={<BookDetails />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/seller" element={<SellerDashboard />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/books" element={<Books />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/orders" element={<Orders />} />

      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}
