import { useContext } from "react"
import { RTCContext } from "../providers/RTCProvider"

export const useRTC = () => {
  const context = useContext(RTCContext);
  if (!context) {
    throw new Error("useRTC must be used within a RTCProvider");
  }
  return context.rtcService;
}