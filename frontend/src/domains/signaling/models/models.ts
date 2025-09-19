export type SDPMessage = {
  sdp_type: 'offer' | 'answer';
  sdp: RTCSessionDescriptionInit; // SDPの内容
  from: string; // 送信者のユーザーID
  to?: string; // 受信者のユーザーID
  room_id: string; // ルームID
};

export type ICEMessage = {
  candidate: string; // ICE候補の文字列
  sdp_mid: string; // SDPのメディア識別子
  sdp_mline_index: number; // SDPのメディア行インデックス
  from: string; // 送信者のユーザーID
  to: string; // 受信者のユーザーID
  room_id: string; // ルームID
};