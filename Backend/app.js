require("dotenv").config();
const express = require("express");
const cors = require("cors");
const queryRoutes = require("./routes/query.route");

const app = express();

app.use(cors());               // frontend alag origin pe ho to zaroori
app.use(express.json());       // JSON body parse

app.use("/api", queryRoutes);

app.get("/health", (_, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
