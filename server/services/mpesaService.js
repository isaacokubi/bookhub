import axios from "axios";

import moment from "moment";

import mpesaConfig from "../config/mpesa.js";

export const getMpesaToken = async () => {
  const auth = Buffer.from(
    `${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`,
  )

    .toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",

    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    },
  );

  return response.data.access_token;
};

export const stkPush = async (phone, amount, reference) => {
  const token = await getMpesaToken();

  const timestamp = moment().format("YYYYMMDDHHmmss");

  const password = Buffer.from(
    mpesaConfig.shortCode + mpesaConfig.passKey + timestamp,
  )

    .toString("base64");

  const response = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",

    {
      BusinessShortCode: mpesaConfig.shortCode,

      Password: password,

      Timestamp: timestamp,

      TransactionType: "CustomerPayBillOnline",

      Amount: amount,

      PartyA: phone,

      PartyB: mpesaConfig.shortCode,

      PhoneNumber: phone,

      CallBackURL: mpesaConfig.callbackURL,

      AccountReference: reference,

      TransactionDesc: "BookHub Kenya Purchase",
    },

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
