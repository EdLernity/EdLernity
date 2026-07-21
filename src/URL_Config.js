const configuredApiUrl = (
  process.env.REACT_APP_BACKEND_URL || "https://edlernity-166q.onrender.com/api/v1"
).replace(/\/$/, "");

export const API_URL = configuredApiUrl;
export const BACKEND_URL = configuredApiUrl.replace(/\/api\/v1$/, "");

/** CRM / intern portal. Production default — override with REACT_APP_CRM_URL for local. */
export const CRM_URL = (
  process.env.REACT_APP_CRM_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://portal.edlernity.com")
).replace(/\/$/, "");
