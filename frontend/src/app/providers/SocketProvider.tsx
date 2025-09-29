import { createContext, useEffect, useState } from "react";
import { SocketService } from "../../domains/services/socketService";
import { createSocketService } from "../../infrastructure/socket/socketServiceImpl";

type SocketValue = {
  socket: SocketService | null;
};

export const SocketContext = createContext<SocketValue | undefined>(undefined);

export const SocketProvider = ({ 
  children,
  roomId,
}: { 
  children: React.ReactNode;
  roomId: string;
}) => {
  const [socket, setSocket] = useState<SocketService | null>(null);

  useEffect(() => {
    const newSocket = createSocketService(`/${roomId}`);
    newSocket.connect()
      .then(() => setSocket(newSocket))
      .catch((err) => {
        console.error("WebSocket connection failed:", err);
      });
    
    return () => socket?.disconnect();
  }, [roomId]);

  if( socket === null ) {
    return <div>Loading...</div>;
  }

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};