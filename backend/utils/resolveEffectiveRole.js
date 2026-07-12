function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function resolveEffectiveRole(user) {
  const storedRole = user?.role || "student";
  const userEmail = (user?.email || "").toLowerCase();

  if (storedRole === "intern") {
    return "intern";
  }

  // Explicit staff roles in the database take precedence over ADMIN_EMAILS.
  if (storedRole === "admin" || storedRole === "manager" || storedRole === "trainer") {
    return storedRole;
  }

  if (getAdminEmails().includes(userEmail)) {
    return "admin";
  }

  return storedRole;
}

module.exports = { resolveEffectiveRole, getAdminEmails };
