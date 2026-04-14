const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const { requireAuth } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.put(
  "/profile",
  requireAuth,
  [
    body("name").optional().trim().isLength({ min: 2, max: 60 }).withMessage("Name must be 2-60 characters long"),
    body("email").optional().isEmail().withMessage("Enter a valid email").normalizeEmail(),
    body("currentPassword").optional().isLength({ min: 8 }).withMessage("Current password is invalid"),
    body("newPassword")
      .optional({ values: "falsy" })
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters long"),
  ],
  validateRequest,
  userController.updateProfile
);

module.exports = router;
