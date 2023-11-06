/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require("nodemailer");

// Nodemailer
const sendEmail = async (options) => {
  // 1) Create transporter (transporters: service that will send email like "Gmail", "Mailgun", "MailTrip", "SendGrid")
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false => port = 587, if true port = 465
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Define email options (Like from, to, subject, emailContent)
  const mailOpts = {
    from: "Mozart Application <RayMobileApp@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
