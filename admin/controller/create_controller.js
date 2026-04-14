

// Hiển thị danh sách & Form thêm mới
exports.getList = (req, res) => {
    const db = req.app.locals.db;
    if (!db) return res.status(500).send("Không có kết nối CSDL");

    const error = req.query.error;
    const sql = "SELECT * FROM categories ORDER BY id DESC";
    db.query(sql, (err, categories) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi server");
        }
        res.render('category_admin', { categories, error });
    });
};

// Thêm danh mục mới
exports.create = (req, res) => {
    const db = req.app.locals.db;
    if (!db) return res.status(500).send("Không có kết nối CSDL");

    const { name } = req.body;
    if (!name) {
        return res.redirect('/admin/categories?error=Vui lòng nhập tên danh mục');
    }

    const sql = "INSERT INTO categories (name) VALUES (?)";
    db.query(sql, [name], (err) => {
        if (err) {
            console.error(err);
            const message = err.code === 'ER_DUP_ENTRY'
                ? 'Tên danh mục đã tồn tại'
                : 'Lỗi khi thêm danh mục';
            return res.redirect('/admin/categories?error=' + encodeURIComponent(message));
        }
        res.redirect('/admin/categories');
    });
};

// Hiển thị Form Sửa
exports.getEditForm = (req, res) => {
    const db = req.app.locals.db;
    if (!db) return res.status(500).send("Không có kết nối CSDL");

    const sql = "SELECT * FROM categories WHERE id = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.redirect('/admin/categories?error=Lỗi server');
        }
        if (!results.length) {
            return res.redirect('/admin/categories?error=Danh mục không tồn tại');
        }
        res.render('routes/edit_ad', { category: results[0] });
    });
};

// Lưu cập nhật Sửa
exports.update = (req, res) => {
    const db = req.app.locals.db;
    if (!db) return res.status(500).send("Không có kết nối CSDL");

    const { name } = req.body;
    const sql = "UPDATE categories SET name = ? WHERE id = ?";
    db.query(sql, [name, req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.redirect('/admin/categories?error=Lỗi khi cập nhật');
        }
        res.redirect('/admin/categories');
    });
};

// Xóa danh mục (Có kiểm tra Logic Bài viết)
exports.delete = (req, res) => {
    const db = req.app.locals.db;
    if (!db) return res.status(500).send("Không có kết nối CSDL");

    const categoryId = req.params.id;
    const checkSql = "SELECT COUNT(*) AS count FROM posts WHERE category_id = ?";

    db.query(checkSql, [categoryId], (err, results) => {
        if (err) {
            console.error(err);
            return res.redirect('/admin/categories?error=Lỗi server');
        }

        if (results[0].count > 0) {
            return res.redirect('/admin/categories?error=Không thể xóa! Đang có bài viết thuộc danh mục này.');
        }

        const deleteSql = "DELETE FROM categories WHERE id = ?";
        db.query(deleteSql, [categoryId], (deleteErr) => {
            if (deleteErr) {
                console.error(deleteErr);
                return res.redirect('/admin/categories?error=Lỗi khi xóa');
            }
            res.redirect('/admin/categories');
        });
    });
};