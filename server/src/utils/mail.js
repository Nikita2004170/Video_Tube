import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Our App",
      link: "https://ourapp.example.com/",
    },
  });
  const emailBody = mailGenerator.generatePlaintext(options.mailgenContent); // generatePlaintext() → generates text email
  const emailHTML = mailGenerator.generate(options.mailgenContent); // generate() → generates HTML email

  const transporter = nodemailer.createTransport({ // Nodemailer connects to Mailtrap using:
    host: process.env.MAILTRAP_HOST,
    port: parseInt(process.env.MAILTRAP_PORT, 10),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
  const mailOptions = {
    from: "nikitasachan63@gmail.com",
    to: options.email,
    subject: options.subject,
    text: emailBody,
    html: emailHTML,
  };
  try {
    await transporter.sendMail(mailOptions);//Send the Email
  } catch (err) {
    console.log("Error sending email:", err);
  }
 };

const emailVerificationMailgen = (userName, verificationLink) => ({
  body: {
    name: userName,
    intro: "Welcome to Our App.",
    action: {
      instructions: "To get started with this App, please click here:",
      button: {
        color: "#22BC66", // Optional action button color
        text: "Confirm your account",
        link: verificationLink,
      },
    },
    outro:
      "Need help, or have questions? Just reply to this email, we'd love to help.",
  },
});
const passwordResetMailgen = (userName, resetLink) => ({
  body: {
    name: userName,
    intro: "You have requested to reset your password.",
    action: {
      instructions: "To reset your password, please click here:",
      button: {
        color: "#FF5733", // Optional action button color
        text: "Reset your password",
        link: resetLink,
      },
    },
    outro: "If you did not request a password reset, please ignore this email.",
  },
});

export { emailVerificationMailgen, passwordResetMailgen, sendMail };