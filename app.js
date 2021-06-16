const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);

module.exports = app;