const fs = require("fs");
const path = require("path");
const File = require("../models/File");
const ShareLink = require("../models/ShareLink");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const createAuditLog = require("../utils/audit");
const { sanitizeBaseName, formatBytes } = require("../utils/fileHelpers");

const buildSort = (sort) => {
  if (sort === "oldest") return { createdAt: 1 };
  if (sort === "mostDownloaded") return { downloadCount: -1, createdAt: -1 };
  return { createdAt: -1 };
};

exports.uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Please choose a file to upload", 400);
  }

  const file = await File.create({
    owner: req.user._id,
    originalName: sanitizeBaseName(path.parse(req.file.originalname).name) + path.extname(req.file.originalname).toLowerCase(),
    storedName: req.file.filename,
    filePath: req.file.path,
    mimeType: req.file.mimetype,
    size: req.file.size,
    visibility: req.body.visibility === "shared" ? "shared" : "private",
  });

  await createAuditLog({ req, userId: req.user._id, action: "file_upload", targetType: "File", targetId: file._id });

  res.status(201).json({
    message: "File uploaded successfully",
    file,
  });
});

exports.getMyFiles = asyncHandler(async (req, res) => {
  const search = req.query.search || "";
  const type = req.query.type || "";
  const sort = req.query.sort || "latest";
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;
  const query = {
    owner: req.user._id,
    ...(search && { originalName: { $regex: search, $options: "i" } }),
    ...(type && { mimeType: { $regex: "^" + type, $options: "i" } }),
  };

  const [files, total] = await Promise.all([
    File.find(query)
      .sort(buildSort(sort))
      .skip((page - 1) * limit)
      .limit(limit),
    File.countDocuments(query),
  ]);

  res.json({
    files: files.map((file) => ({
      ...file.toObject(),
      prettySize: formatBytes(file.size),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

exports.updateFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, owner: req.user._id });

  if (!file) {
    throw new AppError("File not found", 404);
  }

  const actions = [];

  if (req.body.originalName) {
    const ext = path.extname(req.body.originalName) || path.extname(file.originalName);
    const base = sanitizeBaseName(path.basename(req.body.originalName, ext));
    file.originalName = base + ext.toLowerCase();
    actions.push("rename");
  }

  if (req.body.visibility && req.body.visibility !== file.visibility) {
    file.visibility = req.body.visibility;
    actions.push("visibility_change");
  }

  await file.save();

  for (const action of actions) {
    await createAuditLog({ req, userId: req.user._id, action, targetType: "File", targetId: file._id });
  }

  res.json({
    message: "File updated successfully",
    file,
  });
});

exports.deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, owner: req.user._id });

  if (!file) {
    throw new AppError("File not found", 404);
  }

  if (fs.existsSync(file.filePath)) {
    fs.unlinkSync(file.filePath);
  }

  await ShareLink.updateMany({ file: file._id }, { isActive: false });
  await file.deleteOne();
  await createAuditLog({ req, userId: req.user._id, action: "delete", targetType: "File", targetId: file._id });

  res.json({ message: "File deleted successfully" });
});

exports.downloadOwnFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, owner: req.user._id });

  if (!file) {
    throw new AppError("File not found", 404);
  }

  if (!fs.existsSync(file.filePath)) {
    throw new AppError("Stored file is missing on disk", 404);
  }

  res.download(file.filePath, file.originalName);
});
