import transporter from "../config/mailer.js";

export const bookCall = async (req, res) => {
  const { name, email, phone, date, time, query } = req.body;

  try {
    // Send confirmation email to customer
    await transporter.sendMail({
      from: `"Catalyst Consultants" <${process.env.EMAIL}>`,
      to: email,
      replyTo: process.env.COMPANY_EMAIL,
      subject: "Your consultation is booked 🎉",
      html: `
        <h3>Hi ${name},</h3>
        <p>Your consultation has been <b>successfully booked</b>.</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
        <p>We'll call you at <b>${phone}</b></p>
        ${query ? `<p><b>Your query:</b> ${query}</p>` : ""}
        <br/>
        <p>Regards,<br/>
        <b>Team Catalyst Consultants</b></p>
      `,
    });

    // Send booking details to company/admin
    await transporter.sendMail({
      from: `"Catalyst Consultants" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      replyTo: email,
      subject: `New Call Booking - ${name}`,
      html: `
        <h3>New Call Booking Received</h3>
        <p><b>Customer Details:</b></p>
        <ul>
          <li><b>Name:</b> ${name}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Phone:</b> ${phone}</li>
          <li><b>Date:</b> ${date}</li>
          <li><b>Time:</b> ${time}</li>
        </ul>
        ${query ? `<p><b>Customer Query:</b><br/>${query}</p>` : ""}
        <p><i>Please contact the customer at the scheduled time.</i></p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Booking confirmed and notifications sent",
    });

  } catch (error) {
    console.error("Booking Error:", error);

    if (error.code === "EAUTH") {
      return res.status(500).json({
        success: false,
        message: "Email authentication failed. Check App Password.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to send booking email.",
    });
  }
};

export const sendcallback = async (req, res) => {
  const { name, email, phone, date, time, query } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      replyTo: email,
      to: process.env.EMAIL,
      subject: `Callback Request - ${name}`,
      html: `
        <h3>New Callback Request</h3>
        <p><b>Customer Details:</b></p>
        <ul>
          <li><b>Name:</b> ${name}</li>
          <li><b>Email:</b> ${email}</li>
          ${phone ? `<li><b>Phone:</b> ${phone}</li>` : ""}
          ${date ? `<li><b>Preferred Date:</b> ${date}</li>` : ""}
          ${time ? `<li><b>Preferred Time:</b> ${time}</li>` : ""}
        </ul>
        ${query ? `<p><b>Query:</b><br/>${query}</p>` : ""}
      `,
    });
    
    res.status(200).json({ 
      success: true,
      message: "Callback request sent successfully!" 
    });
  } catch (err) {
    console.error("Email send error:", err);
    if (err.code === "EAUTH") {
      return res.status(500).json({ 
        success: false,
        error: "Email auth failed. Check App Password." 
      });
    }
    res.status(500).json({ 
      success: false,
      error: "Failed to send callback request." 
    });
  }
};



