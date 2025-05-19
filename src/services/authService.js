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
      { expiresIn: process.env.JWT_EXPIRE } // Access token hết hạn sau 15 phút
    );

    const refreshToken = crypto.randomBytes(32).toString("hex");
    user.refresh_token = refreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken,
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

  static async refreshToken(refreshToken) {
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) {
      throw new Error("Invalid refresh token");
    }

    // Tạo access token mới
    const accessToken = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return { accessToken };
  }

  static async logout(userId) {
    const user = await User.findOne({ where: { user_id: userId } });
    if (user) {
      user.refresh_token = null; // Xóa refresh token khi đăng xuất
      await user.save();
    }
    return { message: "Logged out successfully" };
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
      <!DOCTYPE html>
      <html lang="vi">
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 20px; text-align: center; background-color: #007bff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              <h2 style="font-size: 24px; color: #ffffff; margin: 0;">Yêu cầu đặt lại mật khẩu</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h1 style="font-size: 22px; color: #333333; margin: 0 0 20px;">Đặt lại mật khẩu của bạn</h1>
              <p style="font-size: 16px; color: #555555; line-height: 1.5; margin: 0 0 20px;">
                Xin chào ${user.full_name || "Người dùng"},<br />
                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu. Link này sẽ hết hạn sau 1 giờ.
              </p>
              <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px; text-align: center;">Đặt lại mật khẩu</a>
              <p style="font-size: 14px; color: #777777; line-height: 1.5; margin: 20px 0 0;">
                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi tại 
                <a href="mailto:support@yourdomain.com" style="color: #007bff; text-decoration: none;">tripguidedut@gmail.com</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center; background-color: #f8f9fa; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="font-size: 14px; color: #777777; margin: 0;">
                © ${new Date().getFullYear()} TripGuide. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
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
