const crypto = require("crypto");
const fs = require("fs");

const ALGORITHM = "aes-256-gcm";

const KEY = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_KEY)
  .digest();

async function encryptFile(inputPath, outputPath) {
  const fileData = fs.readFileSync(inputPath);

  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    KEY,
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(fileData),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  const finalData = Buffer.concat([
    iv,
    tag,
    encrypted,
  ]);

  fs.writeFileSync(outputPath, finalData);
}

async function decryptFile(inputPath, outputPath) {
  const data = fs.readFileSync(inputPath);

  const iv = data.subarray(0, 12);

  const tag = data.subarray(12, 28);

  const encrypted = data.subarray(28);

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    iv
  );

  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  fs.writeFileSync(outputPath, decrypted);
}

module.exports = {
  encryptFile,
  decryptFile,
};