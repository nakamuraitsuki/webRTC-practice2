import { RTCService } from "../services/rtcService"

export interface DataChannelUseCase {
  initLocalStream: () => Promise<MediaStream | null>
  sendData: (label: string, data: string) => void
  onData: (label: string, callback: (data: any) => void) => void
}

export const createDataChannelUseCase = (
  rtc: RTCService
): DataChannelUseCase => {
  return {
    initLocalStream: async () => rtc.initLocalStream(),
    sendData: (label: string, data: string) => rtc.sendData(label, data),
    onData: (label: string, callback: (data: any) => void) => rtc.onData(label, callback),
  }
}