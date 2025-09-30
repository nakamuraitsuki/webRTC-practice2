import { SocketService } from "../../domains/services/socketService";
import { SocketClient } from "./socketClient";
import { MessageTypeMap } from "../../domains/message/models/Message";

export const createSocketService = (endpoint: string): SocketService => {
  const socketClient = new SocketClient("/api/ws" + endpoint);
  return {
    isConnected: () => socketClient.isConnected(),
    connect: async () => socketClient.connect(),
    disconnect: () => socketClient.disconnect(),
    send: (message) => socketClient.send(message),
    // キーによる型取得のためのジェネリクス
    onMessage: <T extends keyof MessageTypeMap>(
      message_type: T,
      callback: (data: MessageTypeMap[T]) => void
    ) => {
      socketClient.on<MessageTypeMap[T]>(message_type, callback);
    },
    offMessage: <T extends keyof MessageTypeMap>(message_type: T) => {
      socketClient.off(message_type);
    }
  }
}