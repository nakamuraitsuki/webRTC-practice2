// Socket通信の抽象化インターフェース

import { Message } from "../../message/models/Message";

export interface SocketService {
  connect(): void; // 接続開始
  disconnect(): void; // 接続終了
  send(message: Message): void; // メッセージ送信
  onMessage(
    message_type: 'text' | 'sdp' | 'ice', 
    callback: (message: Message["payload"]) => void
  ): void; // メッセージ受信のコールバック登録
}