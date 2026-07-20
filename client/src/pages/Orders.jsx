import { useEffect, useState } from "react";

import { getMyOrders } from "../api/orderApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))

      .catch(() => {});
  }, []);

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
text-3xl
font-bold
"
      >
        My Orders
      </h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="
border
p-5
mt-5
rounded
"
        >
          <p>
            Order ID:
            {order._id}
          </p>

          <p>
            Status:
            {order.status}
          </p>

          <p>Amount: KES {order.amount}</p>
        </div>
      ))}
    </div>
  );
}
