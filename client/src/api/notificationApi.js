import api from "./axios";

export const getNotifications =
()=>
api.get(
"/notifications"
);

export const getUnreadCount =
()=>
api.get(
"/notifications/unread"
);

export const markRead =
(id)=>
api.put(
`/notifications/${id}/read`
);