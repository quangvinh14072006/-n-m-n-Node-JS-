function requireAdmin(req, res, next) {
  const currentUser = req.session && req.session.user;
  const isAdmin = currentUser && currentUser.role === 1;

  if (isAdmin) {
    return next();
  }

  res.redirect("/admin/login");
}

module.exports = { requireAdmin };
