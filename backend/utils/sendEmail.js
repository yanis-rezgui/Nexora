import { Resend } from "resend";
import { RESEND_API_KEY } from "../config/env.js";

const resend = new Resend(RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  await resend.emails.send({
    from: "onboarding@resend.dev", // domaine par défaut gratuit
    to,
    subject,
    html
  });
};

export default sendEmail;