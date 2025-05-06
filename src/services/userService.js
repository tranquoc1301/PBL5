const { User } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

class UserService {
  static async getUserById(userId) {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password", "password_reset_token", "password_reset_expires"],
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  static async getUserByEmail(email) {
    const user = await User.findOne({
      where: { email },
      attributes: {
        exclude: ["password", "password_reset_token", "password_reset_expires"],
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  static async createUser(username, email, password, role = "user") {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
  }

  static async updateUser(userId, userData) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    await user.update(userData);
    return await User.findByPk(userId, {
      attributes: {
        exclude: ["password", "password_reset_token", "password_reset_expires"],
      },
    });
  }

  static async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    await user.destroy();
  }

  static async getAllUsers(limit, offset) {
    return await User.findAll({
      limit,
      offset,
      attributes: {
        exclude: ["password", "password_reset_token", "password_reset_expires"],
      },
    });
  }

  static async searchUsers(query) {
    return await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
        ],
      },
      attributes: {
        exclude: ["password", "password_reset_token", "password_reset_expires"],
      },
    });
  }
}

module.exports = UserService;
