const query = require("../utils/dbQuery");

async function subscribe(email) {
  try {
    await query(
      "INSERT INTO newsletter_subscribers (email) VALUES (?)",
      [email],
    );
    return { ok: true };
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      return { ok: false, duplicate: true };
    }
    throw e;
  }
}

async function listAll() {
  return query(
    "SELECT * FROM newsletter_subscribers ORDER BY created_at DESC",
  );
}

module.exports = {
  subscribe,
  listAll,
};
