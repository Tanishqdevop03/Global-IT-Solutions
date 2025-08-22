require("dotenv").config();
const express = require("express");
const cors = require("cors");
const queryRoutes = require("./routes/query.route");

const app = express();

const allowedOrigins = [
  "https://global-it-solutions-pearl.vercel.app",   // Vercel
  "https://globalitsolutions-in.net/",              // Custom domain
  "https://www.globalitsolutions-in.net",
  "http://localhost:5501"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// API routes
app.use("/api", queryRoutes);

// Health check
app.get("/health", (_, res) => res.send("OK"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

