// controllers/UserController.js
const UserService = require("../services/userService");

class UserController {
  // Lấy thông tin người dùng bằng ID
  static async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await UserService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found !" });
      }

      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error:", error: error.message });
    }
  }

  // Lấy thông tin người dùng bằng email
  static async getUserByEmail(req, res) {
    try {
      const email = req.query.email;
      const user = await UserService.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "User not found !" });
      }

      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error:", error: error.message });
    }
  }

  // Tạo người dùng mới
  static async createUser(req, res) {
    try {
      const { username, email, password, role } = req.body;

      const newUser = await UserService.createUser(
        username,
        email,
        password,
        role
      );
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Cập nhật thông tin người dùng
  static async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const userData = req.body;

      const updatedUser = await UserService.updateUser(userId, userData);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Xóa người dùng
  static async deleteUser(req, res) {
    try {
      const userId = req.params.id;

      await UserService.deleteUser(userId);
      res.status(204).json({ message: "User deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error:", error: error.message });
    }
  }

  // Lấy tất cả người dùng (limit: số lượng bản ghi, offset: vị trí bắt đầu)
  static async getAllUsers(req, res) {
    try {
      const { limit = 10, offset = 0 } = req.query;

      const users = await UserService.getAllUsers(limit, offset);
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error:", error: error.message });
    }
  }

  // Tìm kiếm người dùng
  static async searchUsers(req, res) {
    try {
      const query = req.query.q; // Sử dụng query parameter 'q' để truyền chuỗi tìm kiếm
      if (!query) {
        return res
          .status(400)
          .json({ message: "Query parameter 'q' is required" });
      }

      const users = await UserService.searchUsers(query);
      ``;
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error:", error: error.message });
    }
  }
}

module.exports = UserController;
