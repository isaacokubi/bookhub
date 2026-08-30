import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BookDetails from "../pages/BookDetails";
import Books from "../pages/Books";
import Sellers from "../pages/Sellers";
import SellerStore from "../pages/SellerStore";
import Cart from "../pages/Cart";
import Favorites from "../pages/Favorites";
import Orders from "../pages/Orders";
import Checkout from "../pages/Checkout";
import AdminRoute from "./AdminRoute";
import RoleRoute from "./RoleRoute";
import AdminDashboardPro from "../pages/AdminDashboardPro";
import AdminBooks from "../pages/AdminBooks";
import AdminOrders from "../pages/AdminOrders";
import AdminUsers from "../pages/AdminUsers";
import AdminSellers from "../pages/admin/AdminSellers";
import SellerRegister from "../pages/SellerRegister";
import SellerDashboardPro from "../pages/SellerDashboardPro";
import AddBook from "../pages/seller/AddBook";
import MyBooks from "../pages/seller/MyBooks";
import SellerOrders from "../pages/seller/SellerOrders";
import CustomerDashboard from "../pages/CustomerDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/books" element={<Books />} />
      <Route path="/books/:id" element={<BookDetails />} />
      <Route path="/sellers" element={<Sellers />} />
      <Route path="/sellers/:id" element={<SellerStore />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/checkout" element={<Checkout />} />

      <Route path="/dashboard" element={<RoleRoute roles={["buyer", "customer", "user"]}><CustomerDashboard /></RoleRoute>} />

      <Route path="/seller/register" element={<SellerRegister />} />
      <Route path="/seller" element={<RoleRoute roles={["seller", "seller_admin", "tour_guide", "tour_manager"]}><SellerDashboardPro /></RoleRoute>} />
      <Route path="/seller/dashboard" element={<RoleRoute roles={["seller", "seller_admin", "tour_guide", "tour_manager"]}><SellerDashboardPro /></RoleRoute>} />
      <Route path="/seller/add-book" element={<RoleRoute roles={["seller", "seller_admin", "tour_guide", "tour_manager"]}><AddBook /></RoleRoute>} />
      <Route path="/seller/books" element={<RoleRoute roles={["seller", "seller_admin", "tour_guide", "tour_manager"]}><MyBooks /></RoleRoute>} />
      <Route path="/seller/orders" element={<RoleRoute roles={["seller", "seller_admin", "tour_guide", "tour_manager"]}><SellerOrders /></RoleRoute>} />

      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPro /></AdminRoute>} />
      <Route path="/admin/books" element={<AdminRoute><AdminBooks /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/sellers" element={<AdminRoute><AdminSellers /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
