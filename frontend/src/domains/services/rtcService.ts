export interface RTCService {
  /**
   * Offerを作成する
   * @returns OfferのSDP
   */
  createOffer: () => Promise<RTCSessionDescriptionInit>

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
   * 新しいICE Candidateが生成されたときのコールバックを登録する
   * @param callback 新しいICE Candidateが生成されたときに呼ばれるコールバック
   * @returns コールバックの登録を解除するための関数
   */
  onIceCandidate: (callback: (candidate: RTCIceCandidateInit) => void) => () => void

  /**
   * 接続を終了する
   */
  closeConnection: () => void
}