const express = require("express");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const { requireAuth } = require("../middleware/auth");
const { registerValidator, loginValidator } = require("../validators/authValidators");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again later." },
});

router.post("/register", authLimiter, registerValidator, validateRequest, authController.register);
router.post("/login", authLimiter, loginValidator, validateRequest, authController.login);
router.post("/logout", requireAuth, authController.logout);
router.get("/me", requireAuth, authController.me);

module.exports = router;
