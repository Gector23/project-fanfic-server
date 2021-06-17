const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");

const checkError = require("./middleware/check-error");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use(checkError);

module.exports = app;