export interface SignalingUseCase {
  // ルームに参加する
  joinRoom: () => Promise<void>;

  // ルームから退出する
  leaveRoom: () => Promise<void>;

  // オファー、アンサー、ICE候補の処理
  handleOffer: (offer: RTCSessionDescriptionInit) => Promise<void>;
  handleAnswer: (answer: RTCSessionDescriptionInit) => Promise<void>;
  handleICECandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
}