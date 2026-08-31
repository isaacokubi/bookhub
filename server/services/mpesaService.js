import axios from "axios";
import moment from "moment";
import mpesaConfig from "../config/mpesa.js";

const MPESA_ENDPOINTS = {
  sandbox: {
    oauth: "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    stkPush: "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
  },
  production: {
    oauth: "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    stkPush: "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
  },
};

const getMpesaEndpoints = (environment) => {
  const normalizedEnvironment = String(environment || "sandbox").toLowerCase();
  if (!MPESA_ENDPOINTS[normalizedEnvironment]) {
    throw new Error("MPESA_ENV must be either sandbox or production.");
  }
  return MPESA_ENDPOINTS[normalizedEnvironment];
};

export const getMpesaToken = async () => {
  const config = mpesaConfig();
  const { oauth } = getMpesaEndpoints(config.environment);

  try {
    const key = process.env.MPESA_CONSUMER_KEY;
    const secret = process.env.MPESA_CONSUMER_SECRET;

    if (!key || !secret) {
      throw new Error("M-Pesa consumer credentials are not configured.");
    }

    const auth = Buffer.from(`${key}:${secret}`).toString("base64");

    const response = await axios.get(oauth, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      timeout: 30000,
    });

    if (!response.data?.access_token) {
      throw new Error("Safaricom OAuth returned no access token.");
    }

    return response.data.access_token;
  } catch (error) {
    console.error("MPESA TOKEN ERROR:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw error;
  }
};

export const stkPush = async (phone, amount, reference) => {
  const config = mpesaConfig();
  const { stkPush: stkPushUrl } = getMpesaEndpoints(config.environment);

  try {
    if (!config.shortCode) {
      throw new Error("MPESA_SHORTCODE is not configured.");
    }

    if (!config.passKey) {
      throw new Error("MPESA_PASSKEY is not configured.");
    }

    if (!config.callbackURL) {
      throw new Error("MPESA_CALLBACK_URL is not configured.");
    }

    if (!/^https:\/\//i.test(String(config.callbackURL))) {
      throw new Error("MPESA_CALLBACK_URL must use HTTPS.");
    }

    const normalizedPhone = String(phone).replace(/\D/g, "");
    const normalizedAmount = Number(amount);

    if (!/^254[17]\d{8}$/.test(normalizedPhone)) {
      throw new Error("Invalid Kenyan M-Pesa phone number.");
    }

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      throw new Error("Invalid M-Pesa payment amount.");
    }

    const token = await getMpesaToken();
    const timestamp = moment().format("YYYYMMDDHHmmss");

    const password = Buffer.from(
      `${config.shortCode}${config.passKey}${timestamp}`,
    ).toString("base64");

    const payload = {
      BusinessShortCode: String(config.shortCode),
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(normalizedAmount),
      PartyA: normalizedPhone,
      PartyB: String(config.shortCode),
      PhoneNumber: normalizedPhone,
      CallBackURL: config.callbackURL,
      AccountReference: String(reference || "BOOKHUB").slice(0, 20),
      TransactionDesc: "BookHub Kenya Purchase",
    };

    console.log("MPESA STK REQUEST:", {
      environment: config.environment,
      BusinessShortCode: payload.BusinessShortCode,
      TransactionType: payload.TransactionType,
      Amount: payload.Amount,
      PartyA: payload.PartyA,
      PartyB: payload.PartyB,
      PhoneNumber: payload.PhoneNumber,
      CallBackURL: payload.CallBackURL,
      AccountReference: payload.AccountReference,
      TransactionDesc: payload.TransactionDesc,
    });

    const response = await axios.post(stkPushUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    console.log("MPESA STK RESPONSE:", response.data);

    return response.data;
  } catch (error) {
    console.error("STK PUSH ERROR:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message,
    });

    throw error;
  }
};
