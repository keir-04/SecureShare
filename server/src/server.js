const app = require("./app");
const env = require("./config/env");
const connectDb = require("./config/db");

const startServer = async () => {
  try {
    await connectDb();
    app.listen(env.port, () => {
      console.log("SecureShare server running on port " + env.port);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
