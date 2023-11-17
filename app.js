const express = require("express");
const app = express();
const cors = require("cors");

if (process.env.MODE_ENV != "production")
  require("dotenv").config({ path: "./config/config.env" });

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
// Use cors() middleware with the appropriate origin setting to allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
//Importing routes
const token = require("./Routes/token");
const user = require("./Routes/user");

//Using routes
app.use("/api/v1", token);
app.use("/api/v1", user);

module.exports = app;