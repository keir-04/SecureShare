const path = require("path");
const { nanoid } = require("nanoid");

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
  "application/zip",
];

const sanitizeBaseName = (value) =>
  value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_.]+|[-_.]+$/g, "")
    .slice(0, 80) || "file";

const createStoredName = (originalName) => {
  const ext = path.extname(originalName);
  const base = sanitizeBaseName(path.basename(originalName, ext));
  return Date.now() + "-" + nanoid(8) + "-" + base + ext.toLowerCase();
};

const formatBytes = (bytes) => {
  if (!bytes) return "0 Bytes";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return value.toFixed(index === 0 ? 0 : 2) + " " + units[index];
};

module.exports = {
  allowedMimeTypes,
  sanitizeBaseName,
  createStoredName,
  formatBytes,
};
