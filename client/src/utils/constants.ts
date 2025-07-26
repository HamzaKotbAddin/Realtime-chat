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



export const CONTACTS_ROUTES = "/api/contacts";
export const SEARCH_CONTACT = `${CONTACTS_ROUTES}/search`;
export const Get_DM_CONTACTS = `${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS = `${CONTACTS_ROUTES}/get-all-contacts`;


export const MESSAGE_ROUTES = "/api/messages";
export const GET_MESSAGES = `${MESSAGE_ROUTES}/get-messages`;
export const UPLOAD_FILE = `${MESSAGE_ROUTES}/upload-file`;

export const CHANNEL_ROUTES = "/api/channel";
export const CREATE_CHANNEL = `${CHANNEL_ROUTES}/create-channel`;
export const GET_USER_CHANNELS = `${CHANNEL_ROUTES}/get-user-channels`;
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channel-messages`;