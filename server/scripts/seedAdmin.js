const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const connectDb = require("../src/config/db");
const env = require("../src/config/env");
const User = require("../src/models/User");

const run = async () => {
  await connectDb();

  const existingAdmin = await User.findOne({ email: env.adminEmail });
  if (existingAdmin) {
    console.log("Admin already exists: " + env.adminEmail);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await User.create({
    name: "SecureShare Admin",
    email: env.adminEmail,
    passwordHash,
    role: "admin",
  });

  console.log("Admin created: " + env.adminEmail);
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
