const UserService = require("../services/userService");
const { cloudinaryInstance } = require("./../config/configureCloudinary");
const fs = require("fs").promises;

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
        return res.status(404).json({ message: "User not found!" });
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
      let bio = {};
      if (req.body.bio) {
        try {
          bio =
            typeof req.body.bio === "string"
              ? JSON.parse(req.body.bio)
              : req.body.bio;
          if (typeof bio !== "object" || bio === null) {
            throw new Error("Bio must be a valid JSON object");
          }
        } catch (error) {
          console.error("Invalid bio format:", req.body.bio, error);
          return res
            .status(400)
            .json({ message: `Invalid bio format: ${error.message}` });
        }
      }

      const userData = {
        full_name: req.body.full_name,
        username: req.body.username,
        bio,
      };

      if (req.file) {
        const result = await cloudinaryInstance.uploader.upload(req.file.path, {
          folder: "user_avatars",
          resource_type: "image",
        });
        userData.avatar_url = result.secure_url;
        await fs
          .unlink(req.file.path)
          .catch((err) => console.error("Failed to delete temp file:", err));
      } else if (req.body.avatar_url) {
        // Validate avatar_url
        const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
        if (!urlRegex.test(req.body.avatar_url)) {
          return res
            .status(400)
            .json({ message: "Invalid avatar_url: Must be a valid URL" });
        }
        userData.avatar_url = req.body.avatar_url;
      }

      console.log("Updating user with data:", userData);
      const updatedUser = await UserService.updateUser(userId, userData);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Update user error:", error.message);
      res
        .status(400)
        .json({ message: `Failed to update user: ${error.message}` });
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

      const result = await cloudinaryInstance.uploader.upload(req.file.path, {
        folder: "user_avatars",
        resource_type: "image",
      });

      await fs.unlink(req.file.path);
      res.status(200).json({ avatarUrl: result.secure_url });
    } catch (error) {
      if (req.file) await fs.unlink(req.file.path);
      res.status(500).json({
        message: "Failed to upload avatar",
        error: error.message,
      });
    }
  }
}

module.exports = UserController;
