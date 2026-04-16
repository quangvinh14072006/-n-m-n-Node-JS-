function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 1) {
    return next();
  }
  res.redirect("/admin/login");
}

module.exports = { requireAdmin };
