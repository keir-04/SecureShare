const User = require("../models/User");
const AppError = require("../utils/appError");
const { verifyToken } = require("../utils/jwt");
const env = require("../config/env");

const requireAuth = async (req, _res, next) => {
  try {
    const token = req.cookies && req.cookies[env.cookieName];

    if (!token) {
      return next(new AppError("Authentication required", 401));
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    if (user.isBlocked) {
      return next(new AppError("Your account has been blocked", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired session", 401));
  }
};

const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to perform this action", 403));
  }

  next();
};

module.exports = {
  requireAuth,
  requireRole,
};
