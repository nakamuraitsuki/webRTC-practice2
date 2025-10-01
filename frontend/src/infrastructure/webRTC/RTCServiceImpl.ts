import { RTCService } from "../../domains/services/rtcService";
import { RTCClient } from "./RTCClient";

export const createRTCService = (): RTCService => {
  const rtcClient = new RTCClient();
  return {
    createOffer: (options?: { withDataChannel?: boolean }) => rtcClient.createOffer(options),
    respondToOffer: (offer) => rtcClient.createAnswer(offer),
    applyRemoteAnswer: (answer) => rtcClient.setRemoteDescription(answer),
    addRemoteIceCandidate: (candidate) => rtcClient.addIceCandidate(candidate),
    addIceCandidateCallback: (callback) => rtcClient.addIceCandidateCallback(callback),
    removeIceCandidateCallback: () => rtcClient.removeIceCandidateCallback(),
    sendData: (label, data) => rtcClient.sendData(label, data),
    onData: (label, callback) => rtcClient.onData(label, callback),
    closeConnection: () => rtcClient.closeConnection(),
  }
}