import axios from "axios";
import moment from "moment";
import mpesaConfig from "../config/mpesa.js";

export const getMpesaToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`,
    ).toString("base64");

    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );

    return response.data.access_token;
  } catch (error) {
    console.log("MPESA TOKEN ERROR:", error.response?.data || error.message);

    throw error;
  }
};

export const stkPush = async (phone, amount, reference) => {
  try {
    const config = mpesaConfig();

    console.log("MPESA CONFIG CHECK:", {
      shortCode: config.shortCode,

      passKey: config.passKey ? "Loaded" : "Missing",

      callbackURL: config.callbackURL,
    });

    const token = await getMpesaToken();

    const timestamp = moment().format("YYYYMMDDHHmmss");

    const password = Buffer.from(
      config.shortCode + config.passKey + timestamp,
    ).toString("base64");

    const payload = {
      BusinessShortCode: config.shortCode,

      Password: password,

      Timestamp: timestamp,

      TransactionType: "CustomerPayBillOnline",

      Amount: Number(amount),

      PartyA: phone,

      PartyB: config.shortCode,

      PhoneNumber: phone,

      CallBackURL: config.callbackURL,

      AccountReference: reference,

      TransactionDesc: "BookHub Kenya Purchase",
    };

    console.log("STK PAYLOAD:", {
      BusinessShortCode: payload.BusinessShortCode,

      PartyB: payload.PartyB,

      PhoneNumber: payload.PhoneNumber,

      Amount: payload.Amount,

      Callback: payload.CallBackURL,
    });

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",

      payload,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("MPESA RESPONSE:", response.data);

    return response.data;
  } catch (error) {
    console.log("STK PUSH ERROR:", error.response?.data || error.message);

    throw error;
  }
};
