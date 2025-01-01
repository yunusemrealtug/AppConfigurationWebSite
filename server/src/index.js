const express = require("express");
const authRoutes = require("./routes/authRoutes.js");
const parameterRoutes = require("./routes/parameterRoutes.js");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/parameters", parameterRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
