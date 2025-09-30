import { Message } from "../../domains/message/models/Message";

export type URLInput = {
  baseUrl: string;
  endpoint: string;
}

// URLの共通化とMessage型の保証、MessageTypeごとの分岐管理という点でラップの意味がある

export class SocketClient {
  private socket: WebSocket | null = null;
  private readonly baseUrl: string = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  private readonly url: string;
  
  // イベントリスナーを管理するMap
  private listeners: Map<string, (data: any) => void> = new Map();

  constructor(endpoint: string) {
    this.url = this.baseUrl+ endpoint;
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  connect() {
    // すでに接続されている場合は何もしない
    if ( this.socket && this.socket.readyState === WebSocket.OPEN ) {
      return Promise.resolve();
    } 

    // 新しいWebSocket接続を作成 + 接続成功後の処理登録
    return new Promise<void>((resolve, reject) => {
      this.socket = new WebSocket(this.url);
      
      // 接続成功・失敗のハンドリング
      this.socket.onopen = () => {
        console.log("WebSocket connected");

        // メッセージ受信処理をここで登録
        this.socket!.onmessage = (event) => {
          try {
            console.log("WebSocket message received:", event.data);
            const parsed = JSON.parse(event.data);
            const message = parsed as Message;
            const handler = this.listeners.get(message.message_type);
            handler?.(message.payload);
          } catch (e) {
            console.error("Failed to parse WebSocket message:", e);
          }
        };

        resolve();
      };

      this.socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        reject(err);
      };

      this.socket.onclose = () => {
        console.log("WebSocket disconnected");
        this.socket = null;
      };
    });
  }
  
  disconnect() {
    if (!this.socket) return;
    if ( this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
    this.socket = null;
  }

  // イベントリスナーを登録
  on<T>(messageType: string, handler: (data: T) => void) {
    if (!this.socket) {
      console.warn("WebSocket is not connected.");
      return;
    }
    // Mapに登録
    this.listeners.set(messageType, handler as (data: any) => void);
  }

  // イベントリスナーを削除
  off(messageType: string) {
    if (!this.socket) {
      console.warn("WebSocket is not connected.");
      return;
    }
    // Mapから削除
    this.listeners.delete(messageType);
  }

  // Message型で送信
  send(data: Message) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket is not open.");
      return;
    }
    // JSON形式で送る
    this.socket.send(JSON.stringify(data));
  }
}