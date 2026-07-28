// utils/imageUrl.js
//
// Local uploads (profile photos, service images) are stored in the DB as a
// bare filename (e.g. "1690000000-photo.jpg") — the server only serves them
// under /uploads/<folder>/<filename>. Rendering that bare filename directly
// as an <img src> was the reason images weren't showing anywhere on the
// customer side: the browser resolved it against the frontend's own origin,
// which has no such route.
//
// Google/Facebook logins, on the other hand, store the OAuth provider's full
// picture URL directly in profileImage — that must be passed through as-is,
// not prefixed.

import api from "@/services/api";

// Derive the file-serving origin from the same base the app already talks
// to (api.js), so there is exactly one place that knows the backend's URL.
const API_ORIGIN = api.defaults.baseURL.replace(/\/api\/?$/, "");

export const getImageUrl = (value, folder = "profile") => {
  if (!value) return null;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${API_ORIGIN}/uploads/${folder}/${value}`;
};
