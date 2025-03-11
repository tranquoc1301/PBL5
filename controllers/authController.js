const AuthService = require("../services/authService");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await AuthService.register(username, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;
    const result = await AuthService.loginWithGoogle(idToken);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
