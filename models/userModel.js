const query = require("../utils/dbQuery");

async function findByUsername(username) {
  const rows = await query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  return rows[0] || null;
}

async function findById(userid) {
  const rows = await query("SELECT * FROM users WHERE userid = ?", [userid]);
  return rows[0] || null;
}

async function listAll() {
  return query(
    "SELECT userid, username, fullname, role FROM users ORDER BY userid ASC",
  );
}

async function create({ username, password, fullname, role }) {
  const r = await query(
    "INSERT INTO users (username, password, fullname, role) VALUES (?, ?, ?, ?)",
    [username, password, fullname, role ?? 1],
  );
  return r.insertId;
}

async function update(userid, { username, fullname, role }) {
  await query(
    "UPDATE users SET username = ?, fullname = ?, role = ? WHERE userid = ?",
    [username, fullname, role, userid],
  );
}

async function updatePassword(userid, passwordHash) {
  await query("UPDATE users SET password = ? WHERE userid = ?", [
    passwordHash,
    userid,
  ]);
}

async function remove(userid) {
  await query("DELETE FROM users WHERE userid = ?", [userid]);
}

module.exports = {
  findByUsername,
  findById,
  listAll,
  create,
  update,
  updatePassword,
  remove,
};
