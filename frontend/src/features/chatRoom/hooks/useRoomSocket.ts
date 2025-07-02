import { useEffect, useRef, useState, useCallback } from 'react';
import { createRoomSocket, parseRoomMessage, sendRoomMessage } from '../api';
import { TextMessage, Message } from '../type';

export const useRoomSocket = (roomId: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<TextMessage[]>([]);

  useEffect(() => {
    const socket = createRoomSocket(roomId);
    if (!socket) {
      console.error('WebSocket creation failed');
      return;
    }
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = parseRoomMessage(event);
      console.log('Received message:', data);
      // MessageResonse型に変換
      const msg: Message = {
        message_type: data.message_type,
        payload: {
          id: data.payload_id as string,
          user_id: data.payload.user_id as string,
          room_id: data.payload.room_id as string,
          sent_at: data.payload.sent_at as string,
          content: data.payload.content as string,
        } as TextMessage,
      }
      console.log("payload:", msg.payload);
      setMessages((prev) => [...prev, msg.payload as TextMessage]);
    };

    socket.onerror = (err) => console.error('WebSocket error:', err);
    socket.onclose = () => console.log('WebSocket closed');

    return () => {
      socket.close();
    };
  }, [roomId]);

  const sendMessage = useCallback((message: Message) => {
    if (socketRef.current) {
      sendRoomMessage(socketRef.current, message);

      if (message.message_type === 'text') {
        setMessages((prev) => [...prev, message.payload as TextMessage]);
      }
    }
    console.log('Sent message:', message);
  }, []);

  return {
    messages,
    sendMessage,
    socket: socketRef.current,
  };
};
