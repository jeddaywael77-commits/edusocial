import type { Message } from "@/shared/types";

export function isTextMessage(message: Message): boolean {
  return message.type === "TEXT";
}

export function isFileMessage(message: Message): boolean {
  return message.type === "FILE";
}

export function isImageMessage(message: Message): boolean {
  return message.type === "IMAGE";
}

export function isOwnMessage(message: Message, userId: string): boolean {
  return message.senderId === userId;
}

export function getMessageTime(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
