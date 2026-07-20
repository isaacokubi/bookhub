import { useEffect, useState } from "react";

import { getDashboard } from "../api/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getDashboard();

    setStats(res.data);
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div
      className="
container
mx-auto
py-10
"
    >
      <h1
        className="
text-4xl
font-bold
mb-8
"
      >
        Admin Dashboard
      </h1>

      <div
        className="
grid
md:grid-cols-5
gap-5
"
      >
        <div className="border p-5 rounded">
          Users
          <h2>{stats.totalUsers}</h2>
        </div>

        <div className="border p-5 rounded">
          Books
          <h2>{stats.totalBooks}</h2>
        </div>

        <div className="border p-5 rounded">
          Orders
          <h2>{stats.totalOrders}</h2>
        </div>

        <div className="border p-5 rounded">
          Payments
          <h2>{stats.totalPayments}</h2>
        </div>

        <div className="border p-5 rounded">
          Revenueseller
          <h2>KES {stats.revenue}</h2>
        </div>
      </div>
    </div>
  );
}
