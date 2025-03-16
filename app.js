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


module.exports = app;
