export const topics = {
  QUEUE: '/topic/queue',
  FRIENDS: '/user/topic/friends',
  MESSAGES: '/user/topic/messages',
  ONLINE_TRACKING: '/user/topic/online',
  USER_FRIENDS: (username: string) => `/user/${username}/topic/friends`,
  GAME: (id: string) => `/topic/game/${id}`,
  JOIN_GAME: (id: string) => `/app/join/${id}`,
  PLAY_GAME: (id: string) => `/app/game/${id}`,
};
