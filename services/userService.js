const { User } = require("../models");
const { Op } = require("sequelize");

class UserService {
  static async getUserById(userId) {
    return await User.findByPk(userId);
  }

  static async getUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  static async createUser(username, email, password, role = "user") {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    return await User.create({ username, email, password });
  }

  static async updateUser(userId, userData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User is not exist");
    }

    return await user.update(userData);
  }

  static async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User is not exist");
    }

    await user.destroy();
    return true;
  }

  static async getAllUsers(limit = 10, offset = 0) {
    return await User.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  }
  static async searchUsers(query) {
    return await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
        ],
      },
    });
  }
}

module.exports = UserService;
