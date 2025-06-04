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
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        error: "Full name, username, email, and password are required.",
      });
    }

    const result = await AuthService.register(
      fullName,
      username,
      email,
      password,
      role
    );
    return res.status(201).json(result);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ error: "Email or username already exists" });
    }
    return res.status(500).json({ error: "Registration failed" });
  }
};

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, data) => {
    if (err || !data) {
      return res.status(401).json({ error: "Google authentication failed" });
    }

    const { token, user } = data;

    if (!user.google_id) {
      user.google_id = data.profile?.id || user.google_id;
      await user.save();
    }

    const userData = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      fullName: user.full_name || "",
      role: user.role,
      avatar: user.avatar_url || null,
      joinedAt: user.created_at || new Date().toISOString(),
      bio: user.bio || null,
    };
    const frontendUrl = "http://localhost:3000/auth-callback";
    const userDataEncoded = encodeURIComponent(JSON.stringify(userData));
    return res.redirect(
      `${frontendUrl}?token=${token}&user=${userDataEncoded}`
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
    return res.status(200).json({
      message: "Login successful",
      accessToken: token,
      user: {
        user_id: userData.user_id,
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        avatar: userData.avatar,
        joinedAt: userData.joinedAt,
        bio: userData.bio,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: "Invalid user data" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

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
        .json({ error: "Token and new password are required" });
    }

    const response = await AuthService.resetPassword(token, password);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const response = await AuthService.logout(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Logout failed" });
  }
};
