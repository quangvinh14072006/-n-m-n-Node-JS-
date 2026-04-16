const query = require("../utils/dbQuery");

async function getInfo() {
  const rows = await query("SELECT * FROM website_info ORDER BY id ASC LIMIT 1");
  return (
    rows[0] || {
      address: "",
      email: "",
      phone: "",
      facebook_link: "#",
      youtube_link: "#",
      copyright_text: "",
    }
  );
}

async function updateInfo(data) {
  const {
    address,
    email,
    phone,
    facebook_link,
    youtube_link,
    copyright_text,
  } = data;
  const rows = await query("SELECT id FROM website_info ORDER BY id ASC LIMIT 1");
  if (!rows.length) {
    await query(
      `INSERT INTO website_info (address, email, phone, facebook_link, youtube_link, copyright_text)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        address,
        email,
        phone,
        facebook_link,
        youtube_link,
        copyright_text || "",
      ],
    );
    return;
  }
  const id = rows[0].id;
  await query(
    `UPDATE website_info SET address=?, email=?, phone=?, facebook_link=?, youtube_link=?, copyright_text=?
     WHERE id = ?`,
    [
      address,
      email,
      phone,
      facebook_link,
      youtube_link,
      copyright_text || "",
      id,
    ],
  );
}

module.exports = {
  getInfo,
  updateInfo,
};
