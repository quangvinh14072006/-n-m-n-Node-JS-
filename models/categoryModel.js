const query = require("../utils/dbQuery");

async function findAll() {
  return query("SELECT * FROM categories ORDER BY name ASC");
}

async function findActive() {
  return query(
    "SELECT * FROM categories WHERE status = 1 ORDER BY name ASC",
  );
}

async function findById(id) {
  const rows = await query("SELECT * FROM categories WHERE id = ?", [id]);
  return rows[0] || null;
}

async function create({ name, slug, status }) {
  const r = await query(
    "INSERT INTO categories (name, slug, status) VALUES (?, ?, ?)",
    [name, slug, status ?? 1],
  );
  return r.insertId;
}

async function update(id, { name, slug, status }) {
  await query(
    "UPDATE categories SET name = ?, slug = ?, status = ? WHERE id = ?",
    [name, slug, status, id],
  );
}

async function remove(id) {
  await query("DELETE FROM categories WHERE id = ?", [id]);
}

module.exports = {
  findAll,
  findActive,
  findById,
  create,
  update,
  remove,
};
