const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email.
 * @param {string} to - Recipient email
 * @param {string} subject - Subject line
 * @param {string} html - HTML body
 * @param {string} [text] - Optional plain text fallback
 */
const sendEmail = async (to, subject, html, text = "") => {
  const mailOptions = {
    from: `"DevProfile Hub 🚀" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
