const fs = require("fs");
const User = require("../models/User");
const File = require("../models/File");
const ShareLink = require("../models/ShareLink");
const AuditLog = require("../models/AuditLog");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const createAuditLog = require("../utils/audit");

exports.getDashboard = asyncHandler(async (_req, res) => {
  const [users, files, audits, downloads] = await Promise.all([
    User.countDocuments(),
    File.countDocuments(),
    AuditLog.countDocuments(),
    File.aggregate([{ $group: { _id: null, total: { $sum: "$downloadCount" } } }]),
  ]);

  res.json({
    stats: {
      totalUsers: users,
      totalFiles: files,
      totalAuditEvents: audits,
      totalDownloads: downloads[0] ? downloads[0].total : 0,
    },
  });
});

exports.getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  res.json({ users });
});

exports.toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.isBlocked = !user.isBlocked;
  await user.save();
  await createAuditLog({
    req,
    userId: req.user._id,
    action: user.isBlocked ? "user_blocked" : "user_unblocked",
    targetType: "User",
    targetId: user._id,
  });

  res.json({
    message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
    },
  });
});

exports.getAllFiles = asyncHandler(async (_req, res) => {
  const files = await File.find().populate("owner", "name email").sort({ createdAt: -1 });
  res.json({ files });
});

exports.deleteAnyFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    throw new AppError("File not found", 404);
  }

  if (fs.existsSync(file.filePath)) {
    fs.unlinkSync(file.filePath);
  }

  await ShareLink.updateMany({ file: file._id }, { isActive: false });
  await file.deleteOne();
  await createAuditLog({
    req,
    userId: req.user._id,
    action: "admin_file_delete",
    targetType: "File",
    targetId: req.params.id,
  });

  res.json({ message: "File record removed successfully" });
});

exports.getAuditLogs = asyncHandler(async (_req, res) => {
  const logs = await AuditLog.find().populate("user", "name email role").sort({ timestamp: -1 }).limit(200);
  res.json({ logs });
});
