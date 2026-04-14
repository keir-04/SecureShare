const { body, param } = require("express-validator");

const createShareValidator = [
  param("fileId").isMongoId().withMessage("Invalid file id"),
  body("expiresInHours")
    .isInt({ min: 1, max: 720 })
    .withMessage("Expiry must be between 1 and 720 hours"),
  body("password")
    .optional({ values: "falsy" })
    .isLength({ min: 6, max: 64 })
    .withMessage("Share password must be 6-64 characters long"),
];

const tokenValidator = [param("token").trim().isLength({ min: 10 }).withMessage("Invalid share token")];

module.exports = {
  createShareValidator,
  tokenValidator,
};
