import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function SellerRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://bookhub-1-d9b3.onrender.com/api/auth/seller/register",
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        },
      );

      toast.success(
        response.data.message || "Seller account created successfully",
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (error) {
      console.log("Seller registration error:", error.response?.data);

      toast.error(
        error.response?.data?.message || "Seller registration failed",
      );
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Create Seller Account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="
          border
          p-3
          w-full
          rounded
          "
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="
          border
          p-3
          w-full
          rounded
          "
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number (2547XXXXXXXX)"
          value={form.phone}
          onChange={handleChange}
          className="
          border
          p-3
          w-full
          rounded
          "
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="
          border
          p-3
          w-full
          rounded
          "
          required
        />

        <button
          type="submit"
          className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-5
          py-3
          rounded
          w-full
          font-semibold
          "
        >
          Register as Seller
        </button>
      </form>
    </div>
  );
}
