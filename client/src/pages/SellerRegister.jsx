import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function SellerRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const register = async () => {
    try {
      await axios.post(
        "https://bookhub-1-d9b3.onrender.com/api/auth/seller/register",

        form,
      );

      toast.success("Seller account created");
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-lg">
      <h1 className="text-3xl font-bold mb-5">Create Seller Account</h1>

      <input
        className="border p-3 w-full mb-3"
        placeholder="Name"
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <input
        className="border p-3 w-full mb-3"
        placeholder="Email"
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
      />

      <input
        className="border p-3 w-full mb-3"
        placeholder="Password"
        type="password"
        onChange={(e) =>
          setForm({
            ...form,
            password: e.target.value,
          })
        }
      />

      <button
        onClick={register}
        className="
bg-blue-600
text-white
px-5
py-3
rounded
"
      >
        Register as Seller
      </button>
    </div>
  );
}
