import { useEffect, useState } from "react";
import { getSellers, deleteSeller } from "../api/adminApi";

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      const data = await getSellers();

      setSellers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const removeSeller = async (id) => {
    if (!window.confirm("Delete this seller?")) return;

    try {
      await deleteSeller(id);

      setSellers(sellers.filter((seller) => seller._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <h1 className="p-8">Loading Sellers...</h1>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Sellers</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>

            <th className="p-3 text-left">Email</th>

            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {sellers.map((seller) => (
            <tr key={seller._id} className="border-b">
              <td className="p-3">{seller.name}</td>

              <td className="p-3">{seller.email}</td>

              <td className="p-3">
                <button
                  onClick={() => removeSeller(seller._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
