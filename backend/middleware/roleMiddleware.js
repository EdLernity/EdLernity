const { resolveEffectiveRole } = require("../utils/resolveEffectiveRole");

const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const effectiveRole = resolveEffectiveRole(req.user);

  if (!allowedRoles.includes(effectiveRole)) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  req.userRole = effectiveRole;
  next();
};

module.exports = roleMiddleware;
