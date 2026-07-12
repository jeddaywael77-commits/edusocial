import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "@/shared/lib/constants";
import { getAccessToken } from "@/shared/lib/auth";
import { SocketEvents } from "@/shared/lib/socket-events";

type EventCallback = (...args: unknown[]) => void;

class SocketManager {
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<EventCallback>>();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private _connected = false;
  private _userId: string | null = null;

  get connected(): boolean {
    return this._connected;
  }

  connect(): Socket {
    if (this.socket?.connected) return this.socket;
    this.disconnect();

    const token = getAccessToken();
    if (!token) {
      console.warn("[WS] No access token, cannot connect");
      return null as unknown as Socket;
    }

    this.socket = io(API_BASE_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      timeout: 10000,
    });

    this.socket.on("connect", () => {
      this._connected = true;
      console.log("[WS] Connected:", this.socket?.id);
      this.startHeartbeat();
    });

    this.socket.on("disconnect", (reason) => {
      this._connected = false;
      console.log("[WS] Disconnected:", reason);
      this.stopHeartbeat();

      if (reason === "io server disconnect" || reason === "io client disconnect") {
        return;
      }
      this.scheduleReconnect();
    });

    this.socket.on("connect_error", (error) => {
      console.error("[WS] Connection error:", error.message);
      this._connected = false;
    });

    this.socket.on("reconnect", (attempt) => {
      console.log("[WS] Reconnected after", attempt, "attempts");
      this._connected = true;
      this.resubscribeAll();
    });

    this.socket.on("reconnect_attempt", (attempt) => {
      console.log("[WS] Reconnection attempt:", attempt);
      this.updateToken();
    });

    this.socket.on("error", (error) => {
      console.error("[WS] Server error:", error);
    });

    return this.socket;
  }

  disconnect(): void {
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.socket?.disconnect();
    this.socket = null;
    this._connected = false;
    this._userId = null;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  setUserId(userId: string) {
    this._userId = userId;
  }

  private updateToken() {
    if (!this.socket) return;
    const token = getAccessToken();
    if (token) {
      this.socket.auth = { token };
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit("ping");
      }
    }, 25000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      if (!this.socket?.connected) {
        this.updateToken();
        this.socket?.connect();
      }
    }, 2000);
  }

  private resubscribeAll() {
    for (const [event] of this.listeners) {
      if (event !== "connect" && event !== "disconnect") {
        this.socket?.emit(SocketEvents.JOIN_ROOM, { room: event });
      }
    }
  }

  emit(event: string, data?: unknown): void {
    if (!this.socket?.connected) {
      console.warn("[WS] Not connected, cannot emit:", event);
      return;
    }
    this.socket.emit(event, data);
  }

  on(event: string, callback: EventCallback): () => void {
    if (!this.socket) this.connect();
    if (!this.socket) return () => {};

    this.socket.on(event, callback);

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.socket?.off(event, callback);
      this.listeners.get(event)?.delete(callback);
    };
  }

  off(event: string, callback?: EventCallback): void {
    if (callback) {
      this.socket?.off(event, callback);
      this.listeners.get(event)?.delete(callback);
    } else {
      this.socket?.removeAllListeners(event);
      this.listeners.delete(event);
    }
  }

  joinRoom(room: string): void {
    this.emit(SocketEvents.JOIN_ROOM, { room });
  }

  leaveRoom(room: string): void {
    this.emit(SocketEvents.LEAVE_ROOM, { room });
  }

  sendChatMessage(conversationId: string, content: string, type = "text", fileUrl?: string, fileName?: string): void {
    this.emit(SocketEvents.CHAT_SEND_MESSAGE, { conversationId, content, type, fileUrl, fileName });
  }

  sendTyping(conversationId: string, userName: string): void {
    this.emit(SocketEvents.CHAT_TYPING, { conversationId, userName });
  }

  sendStopTyping(conversationId: string): void {
    this.emit(SocketEvents.CHAT_STOP_TYPING, { conversationId });
  }

  markRead(conversationId: string): void {
    this.emit(SocketEvents.MARK_READ, { conversationId });
  }

  trackPresence(targetUserId: string): void {
    this.emit(SocketEvents.PRESENCE_TRACK, { targetUserId });
  }
}

export const socketManager = new SocketManager();
