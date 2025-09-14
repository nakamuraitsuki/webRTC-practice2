export interface RTCService {
  /**
   * 新しい接続を開始する（Offerを作成）
   * @returns OfferのSDP
   */
  initiateConnection: () => Promise<RTCSessionDescriptionInit>

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
   */
  onIceCandidate: (callback: (candidate: RTCIceCandidateInit) => void) => void

  /**
   * 接続を終了する
   */
  closeConnection: () => void
}