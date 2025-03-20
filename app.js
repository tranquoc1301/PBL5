const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const path = require("path"); // Khai báo module path
const session = require("express-session");
const passport = require("./config/passport");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
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
app.set("views", path.join(__dirname, "views"));
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/google-login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "google-login.html"));
});

module.exports = app;
