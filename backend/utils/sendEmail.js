import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (to, subject, html) => {
  console.log("📧 Preparing to send email to:", to);
    try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html,
        });

        console.log("Email sent successfully.", info.response);        
    } catch (err) {
        console.log(err.message);
    }
};
