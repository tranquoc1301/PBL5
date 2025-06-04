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

  static async register(fullName, username, email, password, role) {
    role = role === "admin" ? "admin" : "user";
    const defaultAvatar =
      "https://static.vecteezy.com/system/resources/previews/005/005/788/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg";
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({
        full_name: fullName,
        username,
        email,
        password: hashedPassword,
        role,
        avatar_url: defaultAvatar,
      });
      return { message: "User registered successfully", userId: user.user_id };
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("Email already exists");
      }
      throw error;
    }
  }

  static async generateTokenResponse(user) {
    const accessToken = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return {
      accessToken,
      user: {
        user_id: user.user_id,
        username: user.username,
        fullName: user.full_name,
        role: user.role,
        email: user.email,
        avatar: user.avatar_url,
        joinedAt: user.created_at,
        bio: user.bio,
      },
    };
  }

  static async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Email không tồn tại");

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // Hết hạn sau 1 giờ

    user.password_reset_token = token;
    user.password_reset_expires = expires;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Yêu cầu đặt lại mật khẩu</h2>
        <p>Xin chào ${user.full_name || "Người dùng"},</p>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu. Link này sẽ hết hạn sau 1 giờ.</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi tại <a href="mailto:tripguidedut@gmail.com">tripguidedut@gmail.com</a>.</p>
        <p style="margin-top: 20px;">© ${new Date().getFullYear()} TripGuide. All rights reserved.</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Yêu cầu đặt lại mật khẩu",
      html: emailTemplate,
    });

    return { message: "Email đặt lại mật khẩu đã được gửi." };
  }

  static async resetPassword(token, newPassword) {
    const user = await User.findOne({
      where: {
        password_reset_token: token,
        password_reset_expires: { [Op.gt]: new Date() },
      },
    });

    if (!user) throw new Error("Token không hợp lệ hoặc đã hết hạn");

    user.password = await bcrypt.hash(newPassword, 10);
    user.password_reset_token = null;
    user.password_reset_expires = null;
    await user.save();

    return { message: "Mật khẩu đã được đặt lại thành công." };
  }
}

module.exports = AuthService;
