const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = function validate(req, res, next) {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }
  next();
};
