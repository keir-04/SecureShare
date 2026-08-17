const express = require("express");
const upload = require("../middleware/upload");

const {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
} = require("../controllers/fileController");

const router = express.Router();

// Upload File
router.post("/upload", upload.single("file"), uploadFile);

// Get All Files
router.get("/", getFiles);

// Download File
router.get("/download/:id", downloadFile);

// Delete File
router.delete("/:id", deleteFile);

module.exports = router;