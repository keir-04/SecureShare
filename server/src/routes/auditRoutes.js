const express = require("express");
const auditController = require("../controllers/auditController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/me", requireAuth, auditController.getMyAuditLogs);

module.exports = router;
