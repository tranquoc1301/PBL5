const express = require("express");
const cors = require("cors");
const routes = require("./src/routes"); // Đường dẫn đến file routes/index.js
const path = require("path"); // Khai báo module path
const session = require("express-session");
const passport = require("./src/config/passport"); // Đường dẫn đến file passport.js
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

// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Set up views
app.set("view engine", "ejs");
module.exports = app;
