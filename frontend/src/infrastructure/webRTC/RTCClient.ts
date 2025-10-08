export type IceCandidateCallback = (candidate: RTCIceCandidateInit) => void;

export class RTCClient {
  // 本体
  private pc: RTCPeerConnection;
  // データチャネル
  private dataChannel?: RTCDataChannel;

  // ICE Candidate 一時保存用
  private pendingCandidates: RTCIceCandidateInit[] = [];
  private remoteDescriptionSet: boolean = false;

  constructor() {
    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
  }

  // pendingCandidates の getter
  get iceCandidates(): ReadonlyArray<RTCIceCandidateInit> {
    return this.pendingCandidates;
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

  onTrack(callback: (event: RTCTrackEvent) => void) {
    this.pc.ontrack = (event) => {
      console.log("Track event:", event);
      callback(event);
    };
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
    await this.pc.setRemoteDescription(new RTCSessionDescription(remoteDescription));
    this.remoteDescriptionSet = true;

    // キューに溜まった candidate を追加
    for (const c of this.pendingCandidates) {
      await this.pc.addIceCandidate(new RTCIceCandidate(c));
    }
    this.pendingCandidates = [];
  }
  // Remote ICE Candidate を追加
  async addIceCandidate(candidate: RTCIceCandidateInit) {
    console.log("add ICE candidate", candidate);
    if (!this.remoteDescriptionSet) {
      this.pendingCandidates.push(candidate);
      return;
    }
    await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
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

  /**
   * Electron 環境では自身のAPIで画面キャプチャ等も行えるようにする。
   * @param getMediaStreamFn 任意の MediaStream 取得関数 (省略時はデフォルトの getUserMedia を使用)
   * @returns 取得した MediaStream、もしくは null (デバイスがない場合)
   */
  async addLocalStream(
    getMediaStreamFn?: () => Promise<MediaStream>
  ): Promise<MediaStream | null> {
    try {
      // デバイスを確認する
      const devices = await navigator.mediaDevices.enumerateDevices();

      const hasVideoInput = devices.some( d => d.kind === 'videoinput' );
      const hasAudioInput = devices.some( d => d.kind === 'audioinput' );

      const constraints: MediaStreamConstraints = {
        video: hasVideoInput ? { width: 1280, height: 720 } : false,
        audio: hasAudioInput ? true : false,
      };

      if ( !hasVideoInput && !hasAudioInput ) {
        console.warn("No media input devices found.");
        return null;
      }

      // 任意の関数が提供されていればそれを使用
      const stream = getMediaStreamFn 
        ? await getMediaStreamFn() 
        : await navigator.mediaDevices.getUserMedia(constraints);

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
