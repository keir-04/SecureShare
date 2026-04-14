const AuditLog = require("../models/AuditLog");
const asyncHandler = require("../utils/asyncHandler");

exports.getMyAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find({ user: req.user._id }).sort({ timestamp: -1 }).limit(100);
  res.json({ logs });
});
