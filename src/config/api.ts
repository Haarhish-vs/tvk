const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "https://tvk-backend-lac.vercel.app/api/v1";

const REQUEST_TIMEOUT_MS = 15000;

export { API_BASE_URL, REQUEST_TIMEOUT_MS };
