const AuthService = require("../services/AuthService");
const authService = new AuthService();

const login = (req, res) => {
    try {
      const { username, password } = req.body;
      const result = authService.login(username, password);
      return res.status(200).json({
        data: result,
        success: true,
        message: "Login successful",
        err: {},
      });
    } catch (error) {
      return res.status(401).json({
        data: {},
        success: false,
        message: "Login failed",
        err: {error}
      });
    }
  }


module.exports = {login};