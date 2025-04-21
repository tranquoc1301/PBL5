const UserService = require("../services/userService");

class UserController {
  static async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await UserService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }

  static async getUserByEmail(req, res) {
    try {
      const email = req.params.email;
      const user = await UserService.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "User not found !" });
      }
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const { username, email, password, role } = req.body;
      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ message: "Username, email, and password are required" });
      }
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

  static async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const userData = {
        full_name: req.body.full_name,
        username: req.body.username,
        bio: req.body.bio ? JSON.parse(req.body.bio) : {},
      };
      if (req.file) {
        userData.avatar_url = `/uploads/${req.file.filename}`; // Use avatar_url
      }
      const updatedUser = await UserService.updateUser(userId, userData);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      await UserService.deleteUser(userId);
      res.status(204).json({ message: "User deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const { limit = 10, offset = 0 } = req.query;
      const users = await UserService.getAllUsers(
        parseInt(limit),
        parseInt(offset)
      );
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }

  static async searchUsers(req, res) {
    try {
      const query = req.query.q;
      if (!query) {
        return res
          .status(400)
          .json({ message: "Query parameter 'q' is required" });
      }
      const users = await UserService.searchUsers(query);
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }

  static async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const avatarUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({ avatarUrl });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }
}

module.exports = UserController;
