const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({ req, userId = null, action, targetType = null, targetId = null }) => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      targetType,
      targetId: targetId ? String(targetId) : null,
      ipAddress: req.ip,
      userAgent: req.get("user-agent") || "unknown",
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Audit log write failed", error.message);
  }
};

module.exports = createAuditLog;
