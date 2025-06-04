const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");
const path = require("path");
const session = require("express-session");
const passport = require("./src/config/passport");
const app = express();
require("dotenv").config();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
    exposedHeaders: ["Content-Length", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use("/uploads", express.static("uploads"));
app.use(routes);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
