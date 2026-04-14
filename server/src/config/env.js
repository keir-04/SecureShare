const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/secureshare",
  jwtSecret: process.env.JWT_SECRET || "change-this-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieName: process.env.COOKIE_NAME || "secureshare_token",
  adminEmail: process.env.ADMIN_EMAIL || "admin@secureshare.local",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin123!",
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB) || 10,
};
