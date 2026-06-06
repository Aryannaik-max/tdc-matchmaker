const jwt = require("jsonwebtoken");

class AuthService {
  login(username, password) {
    if (username !== "matchmaker" || password !== "tdc123") {
      throw new Error(
        "Invalid username or password"
      );
    }

    const token = jwt.sign(
      {
        username: "matchmaker",
        role: "matchmaker",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return {
      token,
      user: {
        username: "matchmaker",
        role: "matchmaker",
      },
    };
  }
}

module.exports = AuthService;