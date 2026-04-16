/** Chuẩn hóa đường dẫn ảnh bài viết (URL tuyệt đối, /uploads/..., hoặc img/...) */
function imageUrl(image) {
  if (!image || typeof image !== "string") return "/img/news-110x110-1.jpg";
  const t = image.trim();
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  if (t.startsWith("/")) return t;
  return "/" + t.replace(/^\/+/, "");
}

module.exports = { imageUrl };
