/**
 * Ghép chuỗi query giữ bộ lọc khi chuyển trang (phân trang).
 * Ví dụ: keyword=abc&category_id=2
 */

function buildPublicNewsFilterQuery({ keyword, categoryId, dateFrom, dateTo }) {
  const qs = new URLSearchParams();
  if (keyword) qs.set("keyword", keyword);
  if (categoryId) qs.set("category_id", categoryId);
  if (dateFrom) qs.set("date_from", dateFrom);
  if (dateTo) qs.set("date_to", dateTo);
  return qs.toString();
}

function buildAdminPostFilterQuery({
  keyword,
  categoryId,
  dateFrom,
  dateTo,
  status,
}) {
  const qs = new URLSearchParams(buildPublicNewsFilterQuery({
    keyword,
    categoryId,
    dateFrom,
    dateTo,
  }));
  if (status !== undefined && status !== "" && status !== null) {
    qs.set("status", String(status));
  }
  return qs.toString();
}

module.exports = {
  buildPublicNewsFilterQuery,
  buildAdminPostFilterQuery,
};
