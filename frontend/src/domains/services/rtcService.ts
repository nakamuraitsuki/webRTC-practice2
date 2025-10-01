import { IceCandidateCallback } from "../../infrastructure/webRTC/RTCClient"

export interface RTCService {
  /**
   * Offerを作成する
   * @returns OfferのSDP
   */
  createOffer: (options?: { withDataChannel?: boolean }) => Promise<RTCSessionDescriptionInit>

  /**
   * 受信したOfferに応答する
   * @param offer 受信したOfferのSDP
   * @returns AnswerのSDP
   */
  respondToOffer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>

  /** 
   * 受信したAnswerを適用する
   * @param answer 受信したAnswerのSDP
   */
  applyRemoteAnswer: (answer: RTCSessionDescriptionInit) => Promise<void>

  /**
   * 受信したICE Candidateを追加する
   * @param candidate 受信したICE Candidate
   */
  addRemoteIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>

  /**
   * コールバックを追加する
   * @param callback ICE Candidateが生成されたときに呼ばれるコールバック
   */
  addIceCandidateCallback: (callback: IceCandidateCallback) => void


  /**
   * 
   * @returns コールバックを削除する
   */
  removeIceCandidateCallback: () => void
  
  /**
   * 接続を終了する
   */
  closeConnection: () => void
}