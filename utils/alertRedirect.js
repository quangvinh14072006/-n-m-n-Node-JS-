/**
 * Trả về một trang HTML nhỏ: hiện alert rồi chuyển về URL (dùng cho form POST từ popup / đăng ký).
 * Cách này đơn giản, không cần thêm thư viện — phù hợp người mới học.
 */
function sendAlertThenRedirect(res, message, redirectUrl) {
  const safeMsg = JSON.stringify(String(message));
  const safeUrl = JSON.stringify(String(redirectUrl || "/"));
  res.send(`<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>Thông báo</title></head><body>
<script>alert(${safeMsg});window.location.href=${safeUrl};</script>
</body></html>`);
}

module.exports = { sendAlertThenRedirect };
