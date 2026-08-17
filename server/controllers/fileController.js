const path = require("path");
const fs = require("fs");
const db = require("../config/db");

exports.uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = req.file;

    db.prepare(`
      INSERT INTO files
      (owner_id, original_name, encrypted_name, file_size)
      VALUES (?, ?, ?, ?)
    `).run(
      1,
      file.originalname,
      file.filename,
      file.size
    );

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        id: file.filename,
        name: file.originalname,
        size: file.size,
      },
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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

exports.downloadFile = (req, res) => {
  try {

    const { id } = req.params;

    const file = db
      .prepare("SELECT * FROM files WHERE id = ?")
      .get(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const filePath = path.join(
      __dirname,
      "../uploads/temp",
      file.encrypted_name
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Physical file missing",
      });
    }

    res.download(filePath, file.original_name);

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

    const { id } = req.params;

    const file = db
      .prepare("SELECT * FROM files WHERE id = ?")
      .get(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const filePath = path.join(
      __dirname,
      "../uploads/temp",
      file.encrypted_name
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    db.prepare("DELETE FROM files WHERE id = ?").run(id);

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