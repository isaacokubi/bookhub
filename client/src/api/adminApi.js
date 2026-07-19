import api from "./axios";

export const getDashboard =
()=>
api.get(
"/admin/dashboard"
);

export const getUsers =
()=>
api.get(
"/admin/users"
);

export const getPendingBooks =
()=>
api.get(
"/admin/books/pending"
);

export const approveBook =
(id)=>
api.put(
`/admin/books/${id}/approve`
);

export const rejectBook =
(id)=>
api.put(
`/admin/books/${id}/reject`
);

export const getPayments =
()=>
api.get(
"/admin/payments"
);

export const getPayouts =
()=>
api.get(
"/admin/payouts"
);