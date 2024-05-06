import { env } from '@/utils/env.ts';

export const api: Record<string, string> = {
  http: env.HTTP_URL,
  ws: env.WS_URL,
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
