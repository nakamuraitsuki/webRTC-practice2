import { randomUUID } from "crypto";
import { Message } from "../../message/models/Message";
import { SocketService } from "../../services/socket/socketService";
import { TextMessage } from "../models/TextMessage";

export type SendTextMessageInput = {
  room_id: string; // ルームID
  user_id: string; // ユーザーID
  content: string; // メッセージ内容
};

export interface TextMessageLiveUseCase {
  // メッセージの送信
  sendMessage: (input: SendTextMessageInput) => Promise<void>;

  // メッセージの受信
  receiveMessage: (payload: TextMessage) => Promise<void>;
}

export const createTextMessageLiveUseCase = (socket: SocketService): TextMessageLiveUseCase => {
  return {
    sendMessage: async (input: SendTextMessageInput) => {

      const message: Message<'text'> = {
        message_type: 'text',
        payload: {
          id: randomUUID(),
          room_id: input.room_id,
          user_id: input.user_id,
          content: input.content,
          sent_at: new Date().toISOString(),
        }
      }

      socket.send(message);
    },

    receiveMessage: async (_payload: TextMessage): Promise<void> => {
      // NOTE: Providerで状態更新関数を注入する前提のエントリポイント
    }
  }
}