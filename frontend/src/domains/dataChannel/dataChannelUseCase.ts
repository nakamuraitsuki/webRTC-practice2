import { RTCService } from "../services/rtcService"

export interface DataChannelUseCase {
  initLocalStream: () => Promise<MediaStream | null>
}

export const createDataChannelUseCase = (
  rtc: RTCService
): DataChannelUseCase => {
  return {
    initLocalStream: async () => rtc.initLocalStream(),
  }
}