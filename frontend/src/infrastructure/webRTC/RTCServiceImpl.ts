import { RTCService } from "../../domains/services/rtcService";
import { RTCClient } from "./RTCClient";

export const createRTCService = (): RTCService => {
  const rtcClient = new RTCClient();
  return {
    createOffer: () => rtcClient.createOffer(),
    respondToOffer: (offer) => rtcClient.createAnswer(offer),
    applyRemoteAnswer: (answer) => rtcClient.setRemoteDescription(answer),
    addRemoteIceCandidate: (candidate) => rtcClient.addIceCandidate(candidate),
    addIceCandidateCallback: (callback) => rtcClient.addIceCandidateCallback(callback),
    removeIceCandidateCallback: () => rtcClient.removeIceCandidateCallback(),
    closeConnection: () => rtcClient.closeConnection(),
  }
}