/**
 * JWT utility functions for parsing and extracting information from JWT tokens
 */

/**
 * Parse a JWT token and extract the payload
 * @param token - The JWT token to parse
 * @returns The decoded payload or null if parsing fails
 */
export const parseJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT", e);
    return null;
  }
};

/**
 * Extract user ID from a JWT token
 * @param token - The JWT token
 * @returns The user ID or null if not found
 */
export const getUserIdFromToken = (token: string | null) => {
  if (!token) return null;

  const decoded = parseJwt(token);
  // Try common field names for user ID in JWT tokens
  return (
    decoded?.userId || decoded?.sub || decoded?.id || decoded?.user_id || null
  );
};

/**
 * Get the authenticated user ID from localStorage token
 * @returns The user ID or null if not authenticated
 */
export const getAuthUserId = () => {
  const token = localStorage.getItem("token");
  return getUserIdFromToken(token);
};

/**
 * Check if the current user is authenticated
 * @returns True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getAuthUserId();
};
