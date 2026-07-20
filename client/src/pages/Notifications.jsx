import { useEffect, useState } from "react";

import { getNotifications } from "../api/notificationApi";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getNotifications();

    setNotifications(res.data);
  };

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
mb-6
"
      >
        Notifications
      </h1>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n._id}
            className="
border
rounded
p-4
"
          >
            <h2 className="font-semibold">{n.title}</h2>

            <p>{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
