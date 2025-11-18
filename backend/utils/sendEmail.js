import axios from "axios";

export const sendEmail = async (to, subject, html) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: process.env.SENDER_EMAIL, name: "MERN Auth System" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY, // Brevo API key
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Email sent via Brevo API to:", to);
  } catch (err) {
    console.error("Brevo API email error:", err.response?.data || err.message);
    throw new Error("Email could not be sent via Brevo API.");
  }
};
