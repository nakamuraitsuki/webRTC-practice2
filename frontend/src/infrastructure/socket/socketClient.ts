import { Message } from "../../domains/message/models/Message";

export type URLInput = {
  baseUrl: string;
  endpoint: string;
}

export class SocketClient {
  private socket: WebSocket | null = null;
  private readonly baseUrl: string = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  private readonly url: string;
  
  // イベントリスナーを管理するMap
  private listeners: Map<string, (data: any) => void> = new Map();

  constructor(endpoint: string) {
    this.url = this.baseUrl+ endpoint;
  }

  connect() {
    if (this.socket) {
      console.warn("WebSocket is already connected.");
      return;
    }
    
    this.socket = new WebSocket(this.url);

    // 生成したSocketに対してイベントリスナーを設定
    this.socket.onmessage = (event) => {
      // JSONパース
      const parsed = JSON.parse(event.data);
      // 必ず汎用型で送られてくる
      const message = parsed as Message;
      // 対応ハンドラをMapから取得
      const handler = this.listeners.get(message.message_type);
      // ペイロードを受け渡し
      handler?.(message.payload);
    };

  }

  // イベントリスナーを登録
  // TODO：型について後で吟味
  on<T>(messageType: string, handler: (data: T) => void) {
    if (!this.socket) {
      console.warn("WebSocket is not connected.");
      return;
    }
    // Mapに登録
    this.listeners.set(messageType, handler as (data: any) => void);
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

  disconnect() {
    if (!this.socket) return;

    this.socket.close();
    this.socket = null;
  }
}