/**
 * Ghép chuỗi query giữ bộ lọc khi chuyển trang (phân trang).
 * Ví dụ: keyword=abc&category_id=2
 */

function buildPublicNewsFilterQuery({ keyword, categoryId, dateFrom, dateTo }) {
  const queryString = new URLSearchParams();

  if (keyword) {
    queryString.set("keyword", keyword);
  }
  if (categoryId) {
    queryString.set("category_id", categoryId);
  }
  if (dateFrom) {
    queryString.set("date_from", dateFrom);
  }
  if (dateTo) {
    queryString.set("date_to", dateTo);
  }

  return queryString.toString();
}

function buildAdminPostFilterQuery({
  keyword,
  categoryId,
  dateFrom,
  dateTo,
  status,
}) {
  const queryString = new URLSearchParams(
    buildPublicNewsFilterQuery({
      keyword,
      categoryId,
      dateFrom,
      dateTo,
    }),
  );

  if (status !== undefined && status !== "" && status !== null) {
    queryString.set("status", String(status));
  }

  return queryString.toString();
}

module.exports = {
  buildPublicNewsFilterQuery,
  buildAdminPostFilterQuery,
};
