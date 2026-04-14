const bcrypt = require("bcrypt");
const fs = require("fs");
const { nanoid } = require("nanoid");
const File = require("../models/File");
const ShareLink = require("../models/ShareLink");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const createAuditLog = require("../utils/audit");
const env = require("../config/env");

const getLiveShareLink = async (token) => {
  const shareLink = await ShareLink.findOne({ token }).populate("file");

  if (!shareLink || !shareLink.isActive) {
    throw new AppError("Share link is invalid", 404);
  }

  if (shareLink.expiresAt < new Date()) {
    shareLink.isActive = false;
    await shareLink.save();
    throw new AppError("This share link has expired", 410);
  }

  if (!shareLink.file) {
    throw new AppError("Shared file could not be found", 404);
  }

  return shareLink;
};

exports.createShareLink = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.fileId, owner: req.user._id });

  if (!file) {
    throw new AppError("File not found", 404);
  }

  const { expiresInHours, password } = req.body;
  const expiresAt = new Date(Date.now() + Number(expiresInHours) * 60 * 60 * 1000);

  const shareLink = await ShareLink.create({
    file: file._id,
    owner: req.user._id,
    token: nanoid(24),
    expiresAt,
    passwordHash: password ? await bcrypt.hash(password, 10) : null,
    isActive: true,
  });

  file.visibility = "shared";
  await file.save();

  await createAuditLog({
    req,
    userId: req.user._id,
    action: "share_link_creation",
    targetType: "ShareLink",
    targetId: shareLink._id,
  });

  res.status(201).json({
    message: "Share link created successfully",
    shareLink: {
      id: shareLink._id,
      token: shareLink.token,
      expiresAt: shareLink.expiresAt,
      isPasswordProtected: Boolean(shareLink.passwordHash),
      apiUrl: req.protocol + "://" + req.get("host") + "/api/share/public/" + shareLink.token,
      frontendUrl: env.clientUrl + "/shared/" + shareLink.token,
    },
  });
});

exports.getMyShareLinks = asyncHandler(async (req, res) => {
  const shareLinks = await ShareLink.find({ owner: req.user._id })
    .populate("file", "originalName mimeType size downloadCount visibility")
    .sort({ createdAt: -1 });

  const now = new Date();
  const updatedLinks = await Promise.all(
    shareLinks.map(async (link) => {
      if (link.isActive && link.expiresAt < now) {
        link.isActive = false;
        await link.save();
      }

      return {
        id: link._id,
        token: link.token,
        expiresAt: link.expiresAt,
        isActive: link.isActive,
        isPasswordProtected: Boolean(link.passwordHash),
        frontendUrl: env.clientUrl + "/shared/" + link.token,
        file: link.file,
        createdAt: link.createdAt,
      };
    })
  );

  res.json({ shareLinks: updatedLinks });
});

exports.getShareLinkStatus = asyncHandler(async (req, res) => {
  const shareLink = await getLiveShareLink(req.params.token);

  res.json({
    file: {
      id: shareLink.file._id,
      originalName: shareLink.file.originalName,
      mimeType: shareLink.file.mimeType,
      size: shareLink.file.size,
      downloadCount: shareLink.file.downloadCount,
    },
    shareLink: {
      expiresAt: shareLink.expiresAt,
      isPasswordProtected: Boolean(shareLink.passwordHash),
    },
  });
});

exports.downloadSharedFile = asyncHandler(async (req, res) => {
  const shareLink = await getLiveShareLink(req.params.token);

  if (shareLink.passwordHash) {
    if (!req.body.password) {
      throw new AppError("Password is required for this shared file", 401);
    }

    const isMatch = await bcrypt.compare(req.body.password, shareLink.passwordHash);
    if (!isMatch) {
      throw new AppError("Incorrect share password", 401);
    }
  }

  if (!fs.existsSync(shareLink.file.filePath)) {
    throw new AppError("Shared file is missing on disk", 404);
  }

  await File.updateOne({ _id: shareLink.file._id }, { $inc: { downloadCount: 1 } });
  await createAuditLog({
    req,
    userId: shareLink.owner,
    action: "download",
    targetType: "File",
    targetId: shareLink.file._id,
  });

  res.download(shareLink.file.filePath, shareLink.file.originalName);
});

exports.disableShareLink = asyncHandler(async (req, res) => {
  const shareLink = await ShareLink.findOne({ _id: req.params.id, owner: req.user._id });

  if (!shareLink) {
    throw new AppError("Share link not found", 404);
  }

  shareLink.isActive = false;
  await shareLink.save();

  res.json({ message: "Share link disabled successfully" });
});
