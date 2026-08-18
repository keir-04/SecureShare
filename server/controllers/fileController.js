const path = require("path");
const fs = require("fs");
const os = require("os");
const db = require("../config/db");

const {
  encryptFile,
  decryptFile,
} = require("../utils/encryption");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const originalPath = req.file.path;

    const encryptedName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      ".enc";

    const encryptedPath = path.join(
      __dirname,
      "../uploads/encrypted",
      encryptedName
    );

    if (!fs.existsSync(path.dirname(encryptedPath))) {
      fs.mkdirSync(path.dirname(encryptedPath), {
        recursive: true,
      });
    }

    await encryptFile(originalPath, encryptedPath);
    console.log("Encrypted:", encryptedPath);
    
    fs.unlinkSync(originalPath);
    console.log("Original deleted");
   
    db.prepare(`
      INSERT INTO files
      (owner_id, original_name, encrypted_name, file_size)
      VALUES (?, ?, ?, ?)
    `).run(
      1,
      req.file.originalname,
      encryptedName,
      req.file.size
    );

    res.status(201).json({
      success: true,
      message: "File encrypted and uploaded successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

exports.getFiles = (req, res) => {
  try {

    const files = db.prepare(`
      SELECT *
      FROM files
      ORDER BY uploaded_at DESC
    `).all();

    res.json(files);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch files",
    });

  }
};

exports.downloadFile = async (req, res) => {
  try {

    const file = db.prepare(
      "SELECT * FROM files WHERE id=?"
    ).get(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const encryptedPath = path.join(
      __dirname,
      "../uploads/encrypted",
      file.encrypted_name
    );

    if (!fs.existsSync(encryptedPath)) {
      return res.status(404).json({
        message: "Encrypted file missing",
      });
    }

    const tempPath = path.join(
      os.tmpdir(),
      file.original_name
    );

    await decryptFile(
      encryptedPath,
      tempPath
    );

    res.download(
      tempPath,
      file.original_name,
      () => {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    );

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Download failed",
    });

  }
};

exports.deleteFile = (req, res) => {
  try {

    const file = db.prepare(
      "SELECT * FROM files WHERE id=?"
    ).get(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const encryptedPath = path.join(
      __dirname,
      "../uploads/encrypted",
      file.encrypted_name
    );

    if (fs.existsSync(encryptedPath)) {
      fs.unlinkSync(encryptedPath);
    }

    db.prepare(
      "DELETE FROM files WHERE id=?"
    ).run(req.params.id);

    res.json({
      success: true,
      message: "File deleted successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });

  }
};