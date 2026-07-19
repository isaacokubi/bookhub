import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

console.log("RESEND_API_KEY =", process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  to,
  subject,
  html
) => {
  return resend.emails.send({
    from: "BookHub <noreply@bookhub.co.ke>",
    to,
    subject,
    html,
  });
};