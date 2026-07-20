import { useEffect, useState } from "react";

import { Bell } from "lucide-react";

import { getUnreadCount } from "../../api/notificationApi";

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getUnreadCount();

    setCount(res.data.count);
  };

  return (
    <div
      className="
relative
"
    >
      <Bell />

      {count > 0 && (
        <span
          className="
absolute
-top-2
-right-2
bg-red-500
text-white
rounded-full
text-xs
px-2
"
        >
          {count}
        </span>
      )}
    </div>
  );
}
