const express = require("express");
const fileController = require("../controllers/fileController");
const upload = require("../middleware/upload");
const validateRequest = require("../middleware/validateRequest");
const { requireAuth } = require("../middleware/auth");
const { updateFileValidator, deleteFileValidator, getFilesValidator } = require("../validators/fileValidators");

const router = express.Router();

router.use(requireAuth);
router.get("/", getFilesValidator, validateRequest, fileController.getMyFiles);
router.post("/upload", upload.single("file"), fileController.uploadFile);
router.get("/:id/download", deleteFileValidator, validateRequest, fileController.downloadOwnFile);
router.put("/:id", updateFileValidator, validateRequest, fileController.updateFile);
router.delete("/:id", deleteFileValidator, validateRequest, fileController.deleteFile);

module.exports = router;
