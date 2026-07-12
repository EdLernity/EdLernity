const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const userEmail = (req.user.email || "").toLowerCase();
  const effectiveRole =
    req.user.role === "admin" || adminEmails.includes(userEmail)
      ? "admin"
      : req.user.role || "student";

  if (!allowedRoles.includes(effectiveRole)) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  req.userRole = effectiveRole;
  next();
};

module.exports = roleMiddleware;
