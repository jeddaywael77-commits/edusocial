import type { Notification } from "@/shared/types";

export function isUnread(notification: Notification): boolean {
  return !notification.isRead;
}

export function getNotificationIcon(type: string): string {
  switch (type) {
    case "FRIEND_REQUEST":
      return "user-plus";
    case "MESSAGE":
      return "message-circle";
    case "HOMEWORK":
      return "file-text";
    case "EXAM":
      return "clipboard";
    case "COMMENT":
      return "message-square";
    case "LIKE":
      return "heart";
    case "GROUP":
      return "users";
    case "COURSE":
      return "book-open";
    default:
      return "bell";
  }
}

export function getNotificationColor(type: string): string {
  switch (type) {
    case "FRIEND_REQUEST":
      return "text-blue-400";
    case "MESSAGE":
      return "text-green-400";
    case "HOMEWORK":
      return "text-amber-400";
    case "EXAM":
      return "text-red-400";
    case "COMMENT":
      return "text-purple-400";
    case "LIKE":
      return "text-pink-400";
    default:
      return "text-gray-400";
  }
}

export function getRelativeTime(createdAt: string): string {
  const now = new Date();
  const date = new Date(createdAt);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 7) return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHr > 0) return `${diffHr}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return "Just now";
}
