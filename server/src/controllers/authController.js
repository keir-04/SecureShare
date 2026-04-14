const bcrypt = require("bcrypt");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { signToken } = require("../utils/jwt");
const createAuditLog = require("../utils/audit");
const env = require("../config/env");

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isBlocked: user.isBlocked,
  createdAt: user.createdAt,
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("An account already exists with this email", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  const token = signToken({ id: user._id, role: user.role });

  res.cookie(env.cookieName, token, cookieOptions);
  await createAuditLog({ req, userId: user._id, action: "register", targetType: "User", targetId: user._id });

  res.status(201).json({
    message: "Registration successful",
    user: sanitizeUser(user),
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.isBlocked) {
    throw new AppError("Your account has been blocked", 403);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({ id: user._id, role: user.role });
  res.cookie(env.cookieName, token, cookieOptions);
  await createAuditLog({ req, userId: user._id, action: "login", targetType: "User", targetId: user._id });

  res.json({
    message: "Login successful",
    user: sanitizeUser(user),
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
  });

  if (userId) {
    await createAuditLog({ req, userId, action: "logout", targetType: "User", targetId: userId });
  }

  res.json({ message: "Logged out successfully" });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});
