export const api: Record<string, string> = {
  http: 'https://api.1cedrus.id.vn:9000',
  ws: 'wss://api.1cedrus.id.vn:9000/ws',
};

export const HTTP = 'http://localhost:9000';
export const WS = 'ws://localhost:9000/ws';

export const SIGNUP_URL = `${HTTP}/api/auth/register`;
export const SIGNIN_URL = `${HTTP}/api/auth/authenticate`;
export const VERIFY_URL = `${HTTP}/api/auth/verify`;
export const FRIEND_URL = `${HTTP}/api/friends`;
export const USER_INFORMATION_URL = `${HTTP}/api/user`;
export const PUBLIC_USER_INFORMATION_URL = `${HTTP}/api/public/user`;
export const PUBLIC_USERS_INFORMATION_URL = `${HTTP}/api/public/users`;
export const CURRENT_GAME_URL = `${HTTP}/api/game`;
export const MESSAGES_URL = `${HTTP}/api/messages`;
