// Socket通信の抽象化インターフェース

import { Message, MessageTypeMap } from "../../message/models/Message";

export interface SocketService {
  connect(): void; // 接続開始
  disconnect(): void; // 接続終了
  send(message: Message): void; // メッセージ送信
  onMessage<T extends keyof MessageTypeMap>(
    message_type: T, 
    callback: (message: MessageTypeMap[T]) => void,
  ): void; // メッセージ受信のコールバック登録
  offMessage<T extends keyof MessageTypeMap>(message_type: T): void; // メッセージ受信のコールバック解除
}