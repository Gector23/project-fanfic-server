require("dotenv").config()
const mongoose = require("mongoose");
const http = require("http");

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection to database failed")
  });

const app = require("./app");

const PORT = process.env.PORT || 5000;
app.set("port", PORT);

const server = http.createServer(app);
server.on("error", (err) => {
  console.log(err);
});
server.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`)
});