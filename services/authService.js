const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { admin } = require("../config/firebase");

require("dotenv").config();

class AuthService {
  static async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return { token, user: { username: user.username, role: user.role } };
  }

  static async register(username, email, password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return { message: "User registered successfully", userId: user.user_id };
  }

  static async loginWithGoogle(idToken) {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        username: decodedToken.name || email.split("@")[0],
        email,
        password: null, // Không cần mật khẩu cho Google Sign-In
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return { token, user: { username: user.username, role: user.role } };
  }
}

module.exports = AuthService;
