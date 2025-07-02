import { Message } from "../type";

export const sendRoomMessage = (
  socket: WebSocket,
  message: Message
): void => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      message_type: message.message_type,
      payload: {
        id: message.payload.id,
        user_id: message.payload.user_id,
        room_id: message.payload.room_id,
        sent_at: message.payload.sent_at,
        content: message.payload.content,
      },
    }));
    console.log('Message socket send:', message);
  } else {
    console.warn('WebSocket is not open. Message not sent:', message);
  }
};
