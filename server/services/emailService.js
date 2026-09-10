import { Resend } from "resend";

const getResendClient = () => {
  const apiKey = String(process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) {
    const error = new Error(
      "Email service is not configured. Set RESEND_API_KEY before sending email.",
    );
    error.statusCode = 503;
    error.code = "EMAIL_NOT_CONFIGURED";
    throw error;
  }

  return new Resend(apiKey);
};

export const sendEmail = async (to, subject, html) => {
  return getResendClient().emails.send({
    from: "BookHub <noreply@bookhub.co.ke>",
    to,
    subject,
    html,
  });
};
