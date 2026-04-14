exports.list = (req, res) => {
    const db = req.app.locals.db;
    if (!db) return res.status(500).send("Không có kết nối CSDL");

    const sql = `
        SELECT p.id, p.title, p.views, c.name AS category_name
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.id DESC
    `;

    db.query(sql, (err, posts) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi khi tải danh sách bài viết");
        }
        res.render('post', { posts });
    });
};

exports.createForm = (req, res) => {
    const db = req.app.locals.db;
    if (!db) return res.status(500).send("Không có kết nối CSDL");

    db.query('SELECT id, name FROM categories ORDER BY name', (err, categories) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi khi tải danh mục");
        }
        res.render('post_form', {
            post: null,
            categories,
            action: '/admin/posts/create',
            pageTitle: 'Thêm bài viết mới',
        });
    });
};

exports.create = (req, res) => {
    const db = req.app.locals.db;
    if (!db) return res.status(500).send("Không có kết nối CSDL");

    const { title, category_id, content } = req.body;
    const sql = 'INSERT INTO posts (title, category_id, content, views) VALUES (?, ?, ?, 0)';
    db.query(sql, [title, category_id || null, content || ''], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi khi thêm bài viết");
        }
        res.redirect('/admin/posts');
    });
};

exports.editForm = (req, res) => {
    const db = req.app.locals.db;
    if (!db) return res.status(500).send("Không có kết nối CSDL");

    const postId = req.params.id;
    const postSql = 'SELECT * FROM posts WHERE id = ?';
    const categorySql = 'SELECT id, name FROM categories ORDER BY name';

    db.query(postSql, [postId], (err, posts) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi khi tải bài viết");
        }
        if (!posts.length) {
            return res.redirect('/admin/posts');
        }

        db.query(categorySql, (catErr, categories) => {
            if (catErr) {
                console.error(catErr);
                return res.status(500).send("Lỗi khi tải danh mục");
            }

            res.render('post_form', {
                post: posts[0],
                categories,
                action: `/admin/posts/edit/${postId}`,
                pageTitle: 'Sửa bài viết',
            });
        });
    });
};

exports.update = (req, res) => {
    const db = req.app.locals.db;
    if (!db) return res.status(500).send("Không có kết nối CSDL");

    const postId = req.params.id;
    const { title, category_id, content } = req.body;
    const sql = 'UPDATE posts SET title = ?, category_id = ?, content = ? WHERE id = ?';

    db.query(sql, [title, category_id || null, content || '', postId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi khi cập nhật bài viết");
        }
        res.redirect('/admin/posts');
    });
};

exports.delete = (req, res) => {
    const db = req.app.locals.db;
    if (!db) return res.status(500).send("Không có kết nối CSDL");

    const postId = req.params.id;
    const sql = 'DELETE FROM posts WHERE id = ?';

    db.query(sql, [postId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi khi xóa bài viết");
        }
        res.redirect('/admin/posts');
    });
};
