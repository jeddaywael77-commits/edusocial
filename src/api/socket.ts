import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "@/shared/lib/constants";
import { getAccessToken } from "@/shared/lib/auth";

class SocketManager {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(...args: unknown[]) => void>> = new Map();

  connect(): Socket {
    if (this.socket?.connected) return this.socket;

    const token = getAccessToken();

    this.socket = io(API_BASE_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    this.socket.on("connect", () => {
      console.log("[WS] Connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[WS] Disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("[WS] Connection error:", error.message);
    });

    return this.socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.listeners.clear();
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  emit(event: string, data?: unknown): void {
    if (!this.socket?.connected) {
      console.warn("[WS] Not connected, cannot emit:", event);
      return;
    }
    this.socket.emit(event, data);
  }

  on(event: string, callback: (...args: unknown[]) => void): () => void {
    if (!this.socket) this.connect();

    this.socket!.on(event, callback);

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.socket?.off(event, callback);
      this.listeners.get(event)?.delete(callback);
    };
  }

  off(event: string, callback?: (...args: unknown[]) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
      this.listeners.get(event)?.delete(callback);
    } else {
      this.socket?.removeAllListeners(event);
      this.listeners.delete(event);
    }
  }

  joinRoom(room: string): void {
    this.emit("join-room", { room });
  }

  leaveRoom(room: string): void {
    this.emit("leave-room", { room });
  }

  typing(conversationId: string): void {
    this.emit("typing", { conversationId });
  }

  stopTyping(conversationId: string): void {
    this.emit("stop-typing", { conversationId });
  }
}

export const socketManager = new SocketManager();
