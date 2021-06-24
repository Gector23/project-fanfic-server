const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth");
const preferenceRouter = require("./routes/preference");
const fandomRouter = require("./routes/fandom");

const checkError = require("./middleware/check-error");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use("/api/auth", authRouter);
app.use("/api/preference", preferenceRouter);
app.use("/api/fandom", fandomRouter);
app.use(checkError);

module.exports = app;