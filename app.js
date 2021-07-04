const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth");
const preferenceRouter = require("./routes/preference");
const fanficRouter = require("./routes/fanfic");
const chapterRouter = require("./routes/chapter");
const fandomRouter = require("./routes/fandom");
const tagRouter = require("./routes/tag");

const checkError = require("./middleware/checkError");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use("/api/auth", authRouter);
app.use("/api/preference", preferenceRouter);
app.use("/api/fanfic", fanficRouter);
app.use("/api/chapter", chapterRouter);
app.use("/api/fandom", fandomRouter);
app.use("/api/tag", tagRouter);
app.use(checkError);

module.exports = app;