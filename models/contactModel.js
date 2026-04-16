const query = require("../utils/dbQuery");

async function create({ name, email, phone, subject, message }) {
  const insertResult = await query(
    `INSERT INTO contacts (name, email, phone, subject, message, reviewed)
     VALUES (?, ?, ?, ?, ?, 0)`,
    [name, email, phone || "", subject || "", message],
  );
  return insertResult.insertId;
}

async function adminList() {
  return query(
    "SELECT id, name, email, phone, subject, reviewed, created_at FROM contacts ORDER BY created_at DESC",
  );
}

async function findById(id) {
  const rows = await query("SELECT * FROM contacts WHERE id = ?", [id]);
  return rows[0] || null;
}

async function setReviewed(id, reviewed) {
  await query("UPDATE contacts SET reviewed = ? WHERE id = ?", [reviewed, id]);
}

module.exports = {
  create,
  adminList,
  findById,
  setReviewed,
};
