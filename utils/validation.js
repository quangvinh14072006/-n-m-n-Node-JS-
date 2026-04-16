/**
 * Hàm kiểm tra email đơn giản (đủ dùng cho form bình luận / đăng ký nhận tin).
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const s = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

module.exports = { isValidEmail };
