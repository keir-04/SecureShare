const { body, param, query } = require("express-validator");

const objectIdMessage = "Invalid record id";

const updateFileValidator = [
  param("id").isMongoId().withMessage(objectIdMessage),
  body("originalName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage("File name must be 1-120 characters long"),
  body("visibility")
    .optional()
    .isIn(["private", "shared"])
    .withMessage("Visibility must be private or shared"),
];

const deleteFileValidator = [param("id").isMongoId().withMessage(objectIdMessage)];

const getFilesValidator = [
  query("search").optional().trim().isLength({ max: 120 }).withMessage("Search is too long"),
  query("type").optional().trim().isLength({ max: 120 }).withMessage("Type filter is too long"),
  query("sort").optional().isIn(["latest", "oldest", "mostDownloaded"]).withMessage("Invalid sort option"),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be at least 1"),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
];

module.exports = {
  updateFileValidator,
  deleteFileValidator,
  getFilesValidator,
};
