import { createContext } from "react";
import { createSignalingUseCase, SignalingUseCase } from "../../domains/signaling/usecase/SignalingUseCase";
import { useSocket } from "../hooks/useSocket";
import { useRTC } from "../hooks/useRTC";
import { SocketService } from "../../domains/services/socketService";
import { RTCService } from "../../domains/services/rtcService";

type SignalingContextValue = {
  usecase: SignalingUseCase;
  // hooksで使うためにサービスも提供
  socketService: SocketService;
  rtcService: RTCService;
};

export const SignalingContext = createContext<SignalingContextValue | undefined>(undefined);

export const SignalingProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocket();
  const RTCService = useRTC();

  if (socket === null) {
    return <div>Loading...</div>;
  }

  // SignalingUseCaseの生成
  const usecase: SignalingUseCase = createSignalingUseCase(socket, RTCService);

  return (
    <SignalingContext.Provider value={{ usecase, socketService: socket, rtcService: RTCService }}>
      {children}
    </SignalingContext.Provider>
  );
};