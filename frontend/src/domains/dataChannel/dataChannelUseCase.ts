import { RTCService } from "../services/rtcService"

export interface DataChannelUseCase {
  initLocalStream: () => Promise<MediaStream | null>
  onTrack: (callback: (event: RTCTrackEvent) => void) => void
  closeConnection: () => void
}

export const createDataChannelUseCase = (
  rtc: RTCService
): DataChannelUseCase => {
  return {
    initLocalStream: async () => rtc.initLocalStream(),
    onTrack: (callback) => rtc.onTrack(callback),
    closeConnection: () => rtc.closeConnection(),
  }
}