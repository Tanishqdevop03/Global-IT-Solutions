
const nodemailer = require("nodemailer");

if (!process.env.COMPANY_EMAIL || !process.env.COMPANY_EMAIL_PASS) {
  throw new Error("Missing env: COMPANY_EMAIL / COMPANY_EMAIL_PASS");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.COMPANY_EMAIL,
    pass: process.env.COMPANY_EMAIL_PASS,
  },
});

exports.sendQuery = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const mailOptions = {
    from: process.env.COMPANY_EMAIL,
    replyTo: email,
    to: process.env.COMPANY_EMAIL,
    subject: `Product Query: ${subject}`,
    text: `Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ""}
Message:
${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Query sent successfully!" });
  } catch (err) {
    console.error("Email send error:", err);
    if (err.code === "EAUTH") {
      return res.status(500).json({ error: "Email auth failed. Check App Password." });
    }
    res.status(500).json({ error: "Failed to send email." });
  }
};

