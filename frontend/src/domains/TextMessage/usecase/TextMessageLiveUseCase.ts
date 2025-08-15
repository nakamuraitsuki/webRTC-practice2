import { TextMessage } from "../models/TextMessage";

export interface TextMessageLiveUseCase {
  // メッセージの送信
  sendMessage: (roomId: string, userId: string, content: string) => Promise<void>;

  // メッセージの受信
  receiveMessage: (payload: TextMessage) => Promise<void>;
}

export const createTextMessageLiveUseCase = (socket: 