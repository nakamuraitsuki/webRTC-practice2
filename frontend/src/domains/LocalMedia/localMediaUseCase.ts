import { RTCService } from "../services/rtcService"

export interface LocalMediaUseCase {
  initLocalStream: () => Promise<MediaStream | null>
  onTrack: (callback: (event: RTCTrackEvent) => void) => void
  closeConnection: () => void
}

export const createLocalMediaUseCase = (
  rtc: RTCService
): LocalMediaUseCase => {
  return {
    initLocalStream: async () => rtc.initLocalStream(),
    onTrack: (callback) => rtc.onTrack(callback),
    closeConnection: () => rtc.closeConnection(),
  }
}