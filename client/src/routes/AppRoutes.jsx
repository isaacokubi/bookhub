import { Routes, Route } from "react-router-dom";

// Customer pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BookDetails from "../pages/BookDetails";
import Books from "../pages/Books";
import Cart from "../pages/Cart";
import Favorites from "../pages/Favorites";
import Orders from "../pages/Orders";
import Checkout from "../pages/Checkout";

// Admin
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../pages/AdminDashboard";
import AdminBooks from "../pages/AdminBooks";
import AdminOrders from "../pages/AdminOrders";
import AdminUsers from "../pages/AdminUsers";

// Seller pages
import SellerRegister from "../pages/SellerRegister";
import SellerDashboard from "../pages/seller/SellerDashboard";
import AddBook from "../pages/seller/AddBook";
import MyBooks from "../pages/seller/MyBooks";
import SellerOrders from "../pages/seller/SellerOrders";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Books */}
      <Route path="/books" element={<Books />} />
      <Route path="/books/:id" element={<BookDetails />} />

      {/* Cart */}
      <Route path="/cart" element={<Cart />} />

      {/* Favorites */}
      <Route path="/favorites" element={<Favorites />} />

      {/* Orders */}
      <Route path="/orders" element={<Orders />} />

      {/* Checkout */}
      <Route path="/checkout" element={<Checkout />} />

      {/* Seller Routes */}
      <Route path="/seller/register" element={<SellerRegister />} />
      <Route path="/seller" element={<SellerDashboard />} />
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/seller/add-book" element={<AddBook />} />
      <Route path="/seller/books" element={<MyBooks />} />
      <Route path="/seller/orders" element={<SellerOrders />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/books"
        element={
          <AdminRoute>
            <AdminBooks />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
