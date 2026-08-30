import api from "./axios";

export const initiateMpesa = (data) => api.post("/mpesa/stkpush", data);

export const checkPayment = (orderId) => api.get(`/mpesa/status/${orderId}`);
