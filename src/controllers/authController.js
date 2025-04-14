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
    const { fullName, username, email, password, role } = req.body;

    const result = await AuthService.register(
      fullName,
      username,
      email,
      password,
      role
    );
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
      user.google_id = data.profile?.id || user.google_id;
      await user.save();
    }

    // Chuẩn bị dữ liệu người dùng
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar_url || null,
    };

    // Chuyển hướng đến trang trung gian với query params
    const frontendUrl = "http://localhost:3000/auth-callback";
    const userDataEncoded = encodeURIComponent(JSON.stringify(userData));

    return res.redirect(
      `${frontendUrl}?token=${token}&googleUser=${userDataEncoded}`
    );
  })(req, res, next);
};
exports.authSuccess = (req, res) => {
  const { token, user } = req.query;

  if (!token || !user) {
    return res.status(400).json({ error: "Missing token or user data" });
  }

  try {
    const userData = JSON.parse(decodeURIComponent(user));
    // Return JSON instead of redirecting
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar || null,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: "Invalid user data" });
  }
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
    const { password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ error: "Token và mật khẩu mới là bắt buộc." });
    }

    const response = await AuthService.resetPassword(token, password);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
