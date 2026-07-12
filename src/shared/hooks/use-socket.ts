"use client";

import { useEffect, useCallback, useRef } from "react";
import { socketManager } from "@/api/socket";
import { SocketEvents } from "@/shared/lib/socket-events";
import { getAccessToken } from "@/shared/lib/auth";

export function useSocket(userId?: string) {
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId || !getAccessToken()) return;

    socketManager.connect();
    socketManager.setUserId(userId);

    return () => {
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }
      socketManager.disconnect();
    };
  }, [userId]);

  const on = useCallback(
    (event: string, callback: (...args: unknown[]) => void) => {
      return socketManager.on(event, callback);
    },
    []
  );

  const emit = useCallback((event: string, data?: unknown) => {
    socketManager.emit(event, data);
  }, []);

  const joinRoom = useCallback((room: string) => {
    socketManager.joinRoom(room);
  }, []);

  const leaveRoom = useCallback((room: string) => {
    socketManager.leaveRoom(room);
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, content: string, type?: string, fileUrl?: string, fileName?: string) => {
      socketManager.sendChatMessage(conversationId, content, type, fileUrl, fileName);
    },
    []
  );

  const sendTyping = useCallback((conversationId: string, userName: string) => {
    socketManager.sendTyping(conversationId, userName);
  }, []);

  const sendStopTyping = useCallback((conversationId: string) => {
    socketManager.sendStopTyping(conversationId);
  }, []);

  const markRead = useCallback((conversationId: string) => {
    socketManager.markRead(conversationId);
  }, []);

  const trackPresence = useCallback((targetUserId: string) => {
    socketManager.trackPresence(targetUserId);
  }, []);

  return {
    connected: socketManager.connected,
    on,
    emit,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    sendStopTyping,
    markRead,
    trackPresence,
    SocketEvents,
  };
}
