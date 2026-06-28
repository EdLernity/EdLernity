const configuredApiUrl = (
  process.env.REACT_APP_BACKEND_URL || "https://edlernity-166q.onrender.com/api/v1"
).replace(/\/$/, "");

export const API_URL = configuredApiUrl;
export const BACKEND_URL = configuredApiUrl.replace(/\/api\/v1$/, "");
