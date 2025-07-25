// Socket通信の抽象化インターフェース

import { Message } from "../../message/models/Message";

export interface SocketService {
  connect(): void; // 接続開始
  disconnect(): void; // 接続終了
  send(message: Message): void; // メッセージ送信
  onMessage(callback: (message: Message) => void): void; // メッセージ受信のコールバック登録
  onError(callback: (error: Error) => void): void; // エラー発生時のコールバック登録
}