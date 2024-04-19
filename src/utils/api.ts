export const api: Record<string, string> = {
  http: 'https://api.1cedrus.id.vn:9000',
  ws: 'wss://api.1cedrus.id.vn:9000/ws',
};

export const HTTP = api.http;
export const WS = api.ws;

export const SIGNUP_URL = `${HTTP}/api/auth/register`;
export const SIGNIN_URL = `${HTTP}/api/auth/authenticate`;
export const VERIFY_URL = `${HTTP}/api/auth/verify`;
export const FRIEND_URL = `${HTTP}/api/friends`;
export const USER_INFORMATION_URL = `${HTTP}/api/user`;
export const PUBLIC_USER_INFORMATION_URL = `${HTTP}/api/public/user`;
export const PUBLIC_USERS_INFORMATION_URL = `${HTTP}/api/public/users`;
export const LIST_GAMES = `${HTTP}/api/game`;
export const MESSAGES_URL = `${HTTP}/api/messages`;
