const express = require("express");
const { param } = require("express-validator");
const adminController = require("../controllers/adminController");
const { requireAuth, requireRole } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(requireAuth, requireRole("admin"));
router.get("/dashboard", adminController.getDashboard);
router.get("/users", adminController.getUsers);
router.patch("/users/:id/block", [param("id").isMongoId().withMessage("Invalid user id")], validateRequest, adminController.toggleBlockUser);
router.get("/files", adminController.getAllFiles);
router.delete("/files/:id", [param("id").isMongoId().withMessage("Invalid file id")], validateRequest, adminController.deleteAnyFile);
router.get("/audit-logs", adminController.getAuditLogs);

module.exports = router;
