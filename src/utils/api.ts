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
export const LEADER_BOARD_URL = `${HTTP}/api/public/leader-board`;
export const PUBLIC_USERS_INFORMATION_URL = `${HTTP}/api/public/users`;
export const LIST_GAMES = `${HTTP}/api/game`;
export const MESSAGES_URL = `${HTTP}/api/messages`;
export const CONVERSATION_URL = `${HTTP}/api/conversation`;
export const IMAGE_URL = `${HTTP}/api/image`;
export const RESET_PASSWORD_URL = `${HTTP}/api/auth/reset-password`;
export const VERIFY_EMAIL_URL = `${HTTP}/api/auth/reset-password/verify`;
export const COMPLETE_RESET_PASSWORD_URL = `${HTTP}/api/auth/reset-password/complete`;
export const CHANGE_PROFILE_PIC = `${HTTP}/api/user/profile-picture`;
export const CHANGE_PASSWORD_URL = `${HTTP}/api/auth/change-password`;
export const CHANGE_EMAIL_URL = `${HTTP}/api/user/email`;
