import { RTCService } from "../services/rtcService"

export interface LocalMediaUseCase {
  initLocalStream: (getMediaStreamFn?: () => Promise<MediaStream|null>) => Promise<MediaStream | null>
  onTrack: (callback: (event: RTCTrackEvent) => void) => void
  closeConnection: () => void
}

export const createLocalMediaUseCase = (
  rtc: RTCService
): LocalMediaUseCase => {
  return {
    initLocalStream: async (getMediaStreamFn?: () => Promise<MediaStream|null>) => rtc.initLocalStream(getMediaStreamFn),
    onTrack: (callback) => rtc.onTrack(callback),
    closeConnection: () => rtc.closeConnection(),
  }
}