import { useEffect, useState } from "react";

import { io } from "socket.io-client";

export default function useSocket(userId) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
    );

    newSocket.emit("join", userId);

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return socket;
}
