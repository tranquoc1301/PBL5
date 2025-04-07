const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../models");
const transporter = require("../config/mail");
const { Op } = require("sequelize");

class AuthService {
  static async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    return this.generateTokenResponse(user);
  }

  static async register(username, email, password, role) {
    if (!username || !email || !password) {
      throw new Error("Username, email, and password are required");
    }
    role = role === "admin" ? "admin" : "user";
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });
      return { message: "User registered successfully", userId: user.user_id };
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("Email already exists");
      }
      throw error;
    }
  }

  static generateTokenResponse(user) {
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return {
      token,
      user: {
        username: user.username,
        role: user.role,
      },
    };
  }
  static async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Email không tồn tại");

    // Tạo token reset
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // Hết hạn sau 1 giờ

    user.reset_password_token = token;
    user.reset_password_expires = expires;
    await user.save();

    // Gửi email chứa link reset
    const resetLink = `http://localhost:8080/auth/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Đặt lại mật khẩu",
      html: `<p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấp vào <a href="${resetLink}">đây</a> để tiếp tục.</p>`,
    });

    return { message: "Email đặt lại mật khẩu đã được gửi." };
  }
  static async resetPassword(token, newPassword) {
    const user = await User.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { [Op.gt]: new Date() }, // Kiểm tra token có hết hạn chưa
      },
    });

    if (!user) throw new Error("Token không hợp lệ hoặc đã hết hạn");

    // Mã hoá mật khẩu mới và lưu vào DB
    user.password = await bcrypt.hash(newPassword, 10);
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    return { message: "Mật khẩu đã được đặt lại thành công." };
  }
}

module.exports = AuthService;
