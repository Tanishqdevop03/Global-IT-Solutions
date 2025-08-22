require("dotenv").config();
const express = require("express");
const cors = require("cors");
const queryRoutes = require("./routes/query.route");

const app = express();
const allowed = [
  "https://www.globalitsolutions-in.net",
  "https://global-it-solutions-pearl.vercel.app",
  "http://localhost:5501/index.html"
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: [ "POST"]
}));
              // frontend alag origin pe ho to zaroori
app.use(express.json());       // JSON body parse

app.use("/api", queryRoutes);

app.get("/health", (_, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
