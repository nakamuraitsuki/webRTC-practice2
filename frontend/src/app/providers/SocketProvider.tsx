import { createContext } from "react";
import { SocketService } from "../../domains/services/socket/socketService"
import { createSocketService } from "../../infrastructure/socket/socketServiceImpl";

type SocketValue = {
  socketService: SocketService;
};

export const SocketContext = createContext<SocketValue | undefined>(undefined);

export const SocketProvider = ({ 
  children,
  roomId,
}: { 
  children: React.ReactNode;
  roomId: string;
}) => {
  const socketService = createSocketService(`/${roomId}`);
  
  return (
    <SocketContext.Provider value={{ socketService }}>
      {children}
    </SocketContext.Provider>
  );
};