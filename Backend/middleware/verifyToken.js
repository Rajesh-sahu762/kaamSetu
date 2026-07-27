const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const verifyToken = async (req, res, next) => {

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Re-check the account on every request. Without this, a token issued
    // before a user was deactivated/deleted keeps working until it expires.
    const user = await userModel.findById(decoded.userId).select(
      "role isActive isDeleted"
    );

    if (!user || user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: "Account no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support if you want to reactivate it.",
      });
    }

    // Trust the DB's current role over whatever the token was signed with
    // (covers older tokens signed before role was consistently included).
    req.user = { ...decoded, role: user.role };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = verifyToken;