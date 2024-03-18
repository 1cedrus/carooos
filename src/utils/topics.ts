export const topics = {
  QUEUE: '/topic/queue',
  FRIENDS: '/user/topic/friends',
  MESSAGES: '/user/topic/messages',
  USER_FRIENDS: (username: string) => `/user/${username}/topic/friends`,
};
