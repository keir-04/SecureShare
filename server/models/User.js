const db = require("../config/db");

function createUser(fullname, email, password) {
  const stmt = db.prepare(`
    INSERT INTO users (fullname, email, password)
    VALUES (?, ?, ?)
  `);

  return stmt.run(fullname, email, password);
}

function findUserByEmail(email) {
  const stmt = db.prepare(`
    SELECT * FROM users WHERE email = ?
  `);

  return stmt.get(email);
}

module.exports = {
  createUser,
  findUserByEmail,
};