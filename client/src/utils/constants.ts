export const NEXTJS_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export const AUTH_ROUTES = "/api/auth";
export const AUTH_SIGNUP = `${AUTH_ROUTES}/signup`;
export const AUTH_LOGIN = `${AUTH_ROUTES}/login`;
export const AUTH_LOGOUT = `${AUTH_ROUTES}/logout`;
export const AUTH_PROFILE = `${AUTH_ROUTES}/profile`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATED_USER_INFO = `${AUTH_ROUTES}/update-user-info`;
export const UPDATED_USER_IMAGE = `${AUTH_ROUTES}/update-user-image`;
export const REMOVED_USER_IMAGE = `${AUTH_ROUTES}/remove-user-image`;
