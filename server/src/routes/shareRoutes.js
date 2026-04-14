const express = require("express");
const { body, param } = require("express-validator");
const shareController = require("../controllers/shareController");
const validateRequest = require("../middleware/validateRequest");
const { requireAuth } = require("../middleware/auth");
const { createShareValidator, tokenValidator } = require("../validators/shareValidators");

const router = express.Router();

router.get("/mine", requireAuth, shareController.getMyShareLinks);
router.post("/:fileId", requireAuth, createShareValidator, validateRequest, shareController.createShareLink);
router.delete(
  "/:id",
  requireAuth,
  [param("id").isMongoId().withMessage("Invalid share link id")],
  validateRequest,
  shareController.disableShareLink
);
router.get("/public/:token", tokenValidator, validateRequest, shareController.getShareLinkStatus);
router.post(
  "/public/:token/download",
  [
    ...tokenValidator,
    body("password").optional({ values: "falsy" }).isLength({ min: 6, max: 64 }).withMessage("Password is invalid"),
  ],
  validateRequest,
  shareController.downloadSharedFile
);

module.exports = router;
