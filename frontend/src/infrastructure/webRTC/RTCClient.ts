export type IceCandidateCallback = (candidate: RTCIceCandidateInit) => void;

export class RTCClient {
  private pc: RTCPeerConnection;
  private dataChannel?: RTCDataChannel;

  constructor() {
    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
  }

  // Data Channel の作成
  createDataChannel(label: string = "data") {
    this.dataChannel = this.pc.createDataChannel(label);
    this.dataChannel.onopen = () => {
      console.log("Data channel is open");
    };
    this.dataChannel.onmessage = (event) => {
      console.log("Received message:", event.data);
    };
    this.dataChannel.onclose = () => {
      console.log("Data channel is closed");
    };
  }

  onDataChannel(callback: (channel: RTCDataChannel) => void) {
    this.pc.ondatachannel = (event) => {
      console.log("Data channel received");
      this.dataChannel = event.channel;
      this.dataChannel.onopen = () => {
        console.log("Data channel is open");
      };
      this.dataChannel.onmessage = (event) => {
        console.log("Received message:", event.data);
      };
      this.dataChannel.onclose = () => {
        console.log("Data channel is closed");
      };
      callback(this.dataChannel);
    };
  }

  sendData(_label: string, data: string) {
    if (this.dataChannel && this.dataChannel.readyState === "open") {
      this.dataChannel.send(data);
      console.log("Sent message:", data);
    } else {
      console.warn("Data channel is not open. Cannot send message.");
    }
  }

  onData(_label: string, callback: (data: any) => void) {
    const channel = this.dataChannel;
    if (!channel) {
      console.warn(`DataChannel not found`);
      return;
    }
    channel.onmessage = (event) => callback(event.data);
  }

  /**
   * offer を作成
   * @param options { withDataChannel?: boolean } - if true, create a DataChannel
   * @returns offer 
   */
  async createOffer(options?: { withDataChannel?: boolean }): Promise<RTCSessionDescriptionInit> {
    if ( options?.withDataChannel ) {
      this.createDataChannel();
    }
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    console.log("create offer", offer);
    return offer;
  }

  // Remote Offer を受けて Answer を作成
  async createAnswer(remoteOffer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    await this.pc.setRemoteDescription(new RTCSessionDescription(remoteOffer));
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    console.log("receive offer and sent answer", remoteOffer);
    return answer;
  }

  // Remote Description (Offer/Answer) を適用
  async setRemoteDescription(remoteDescription: RTCSessionDescriptionInit) {
    console.log("set remote description", remoteDescription);
    await this.pc.setRemoteDescription(new RTCSessionDescription(remoteDescription));
  }

  // Remote ICE Candidate を追加
  async addIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      console.log("add ICE candidate", candidate);
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
        console.log("new ICE candidate", event.candidate);
        callback(event.candidate.toJSON());
      }
    };
  }

  // コールバックの削除
  removeIceCandidateCallback() {
    this.pc.onicecandidate = null;
  }

  async addLocalStream(): Promise<MediaStream | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => this.pc.addTrack(track, stream));
      return stream;
    } catch (err) {
      console.error("Failed to get local media:", err);
      return null;
    }
  }

  closeConnection() {
    this.pc.close();
  }
}
