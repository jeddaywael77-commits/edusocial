export const SocketEvents = {
  // Connection lifecycle
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',

  // Client -> Server
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  TYPING: 'typing',
  STOP_TYPING: 'stop-typing',
  MARK_READ: 'mark-read',

  // Chat events
  CHAT_SEND_MESSAGE: 'chat:send-message',
  CHAT_RECEIVE_MESSAGE: 'chat:receive-message',
  CHAT_TYPING: 'chat:typing',
  CHAT_STOP_TYPING: 'chat:stop-typing',
  CHAT_READ_RECEIPT: 'chat:read-receipt',
  CHAT_USER_ONLINE: 'chat:user-online',
  CHAT_USER_OFFLINE: 'chat:user-offline',

  // Notification events
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_UNREAD_COUNT: 'notification:unread-count',

  // Friend events
  FRIEND_REQUEST_SENT: 'friend:request-sent',
  FRIEND_REQUEST_ACCEPTED: 'friend:request-accepted',
  FRIEND_REQUEST_DECLINED: 'friend:request-declined',
  FRIEND_REMOVED: 'friend:removed',

  // Feed events
  FEED_NEW_POST: 'feed:new-post',
  FEED_NEW_COMMENT: 'feed:new-comment',
  FEED_NEW_REACTION: 'feed:new-reaction',
  FEED_POST_SHARED: 'feed:post-shared',

  // Story events
  STORY_NEW: 'story:new',
  STORY_VIEW: 'story:view',

  // Presence events
  PRESENCE_ONLINE: 'presence:online',
  PRESENCE_OFFLINE: 'presence:offline',
  PRESENCE_TRACK: 'presence:track',

  // Course events
  COURSE_UPDATED: 'course:updated',
  COURSE_LESSON_ADDED: 'course:lesson-added',

  // Group events
  GROUP_NEW_POST: 'group:new-post',
  GROUP_MEMBER_JOINED: 'group:member-joined',
  GROUP_MEMBER_LEFT: 'group:member-left',

  // Gamification events
  GAMIFICATION_XP_GAINED: 'gamification:xp-gained',
  GAMIFICATION_BADGE_EARNED: 'gamification:badge-earned',

  // Server -> Client error
  ERROR: 'error',
} as const;

export type SocketEvent = (typeof SocketEvents)[keyof typeof SocketEvents];
