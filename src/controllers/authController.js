const AuthService = require("../services/authService");
const passport = require("../config/passport");
const { User } = require("../models");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const result = await AuthService.login(email, password);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required." });
    }

    const result = await AuthService.register(username, email, password, role);
    return res.status(201).json(result);
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(409).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, data) => {
    if (err || !data) {
      return res.status(401).json({ error: "Google authentication failed." });
    }

    const { token, user } = data;

    if (!user.google_id) {
      user.google_id = user.google_id || profile.id;
      await user.save();
    }

    return res.redirect(`/auth/success?token=${token}`);
  })(req, res, next);
};

exports.authSuccess = (req, res) => {
  const { token } = req.query;
  return res.json({ message: "Login successful", token });
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await AuthService.forgotPassword(email);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const response = await AuthService.resetPassword(token, newPassword);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
