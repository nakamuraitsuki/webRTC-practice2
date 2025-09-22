import { createContext } from "react";
import { RTCService } from "../../domains/services/rtcService";
import { createRTCService } from "../../infrastructure/webRTC/RTCServiceImpl";
type RTCValue = {
  rtcService: RTCService;
};

export const RTCContext = createContext<RTCValue | undefined>(undefined);

export const RTCProvider = ({ children } : { children: React.ReactNode }) => {
  const rtcService: RTCService = createRTCService();
  return (
    <RTCContext.Provider value={{ rtcService }}>
      {children}
    </RTCContext.Provider>
  );
};