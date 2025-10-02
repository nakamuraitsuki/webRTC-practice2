import { Message } from "../../domains/message/models/Message";

export class SocketClient {
  private socket: WebSocket | null = null;
  private readonly baseUrl: string = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  private readonly url: string;
  
  // イベントリスナーを管理するMap
  private listeners: Map<string, (data: any) => void> = new Map();

  constructor(endpoint: string) {
    this.url = this.baseUrl + endpoint;
  }

  /** 接続状態の確認 */
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  /** WebSocket に接続 */
  connect(): Promise<void> {
    if (this.isConnected()) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(this.url);

      // 接続成功時
      ws.onopen = () => {
        console.log("WebSocket connected");
        this.socket = ws;
        resolve();
      };

      // メッセージ受信処理（常に Map を参照）
      ws.onmessage = (event) => {
        try {
          console.log("WebSocket message received:", event.data);
          const parsed = JSON.parse(event.data) as Message;
          const handler = this.listeners.get(parsed.message_type);
          handler?.(parsed.payload);
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        reject(err);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.socket = null;
      };
    });
  }

  /** WebSocket を切断 */
  disconnect() {
    if (!this.socket) return;
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
    this.socket = null;
  }

  /** イベントリスナーを登録（接続前でもOK） */
  on<T>(messageType: string, handler: (data: T) => void) {
    this.listeners.set(messageType, handler as (data: any) => void);
  }

  /** イベントリスナーを削除 */
  off(messageType: string) {
    this.listeners.delete(messageType);
  }

  /** Message型で送信 */
  send(data: Message) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket is not open.");
      return;
    }
    this.socket.send(JSON.stringify(data));
  }
}
