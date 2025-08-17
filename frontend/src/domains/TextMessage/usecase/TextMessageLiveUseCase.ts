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
      const message: Message = {
        message_type: 'text',
        payload: input as TextMessage
      }

      socket.send(message);
    },

    receiveMessage: async (_payload: TextMessage): Promise<void> => {
      // NOTE: Providerで状態更新関数を注入する前提のエントリポイント
    }
  }
}