export type IceCandidateCallback = (candidate: RTCIceCandidateInit) => void;

export class RTCClient {
  private pc: RTCPeerConnection;

  constructor() {
    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
  }

  // Offer を作成
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return offer;
  }

  // Remote Offer を受けて Answer を作成
  async createAnswer(remoteOffer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    await this.pc.setRemoteDescription(new RTCSessionDescription(remoteOffer));
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    return answer;
  }

  // Remote Description (Offer/Answer) を適用
  async setRemoteDescription(remoteDescription: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(remoteDescription));
  }

  // Remote ICE Candidate を追加
  async addIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Failed to add ICE candidate:", error, candidate);
      throw new Error("Failed to add ICE candidate: " + (error instanceof Error ? error.message : String(error)));
    }
  }

  // コールバックの追加
  addIceCandidateCallback(callback: IceCandidateCallback) {
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        callback(event.candidate.toJSON());
      }
    };
  }

  // コールバックの削除
  removeIceCandidateCallback() {
    this.pc.onicecandidate = null;
  }

  closeConnection() {
    this.pc.close();
  }
}
