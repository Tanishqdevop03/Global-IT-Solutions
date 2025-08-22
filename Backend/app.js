require("dotenv").config();
const express = require("express");
const cors = require("cors");
const queryRoutes = require("./routes/query.route");

const app = express();

const allowed = [
  "https://globalitsolutions-in.net",
  "https://global-it-solutions-pearl.vercel.app",
  "http://localhost:5501"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "OPTIONS"]
}));

app.use(express.json());

app.use("/api", queryRoutes);

app.get("/health", (_, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

