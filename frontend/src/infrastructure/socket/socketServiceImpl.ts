import { SocketService } from "../../domains/services/socket/socketService";
import { TextMessage } from "../../domains/TextMessage/models/TextMessage";
import { SocketClient } from "./socketClient";

type MessageTypeMap = {
  'text': TextMessage;
};

export const createSocketService = (): SocketService => {
  const socketClient = new SocketClient("/ws");
  return {
    connect: () => socketClient.connect(),
    disconnect: () => socketClient.disconnect(),
    send: (message) => socketClient.send(message),
    // キーによる型取得のためのジェネリクス
    onMessage: <T extends keyof MessageTypeMap>(
      message_type: T, 
      callback: (data: MessageTypeMap[T]) => void) => {
      socketClient.on<MessageTypeMap[T]>(message_type, callback);
    },
  }
}