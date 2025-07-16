export type Message = {
  message_type: 'text' | 'sdp' | 'ice';
  payload: TextMessage | SDPMessage | ICEMessage;
}

export type TextMessage = {
  id: string; // 一意のID
  room_id: string; // ルームID
  user_id: string; // ユーザーID
  content: string; // メッセージ内容
  sent_at: string; // メッセージ送信日時（ISO形式）
}

export type SDPMessage = {
  sdp_type: 'offer' | 'answer';
  sdp: string; // SDPの内容
  from: string; // 送信者のユーザーID
  to: string; // 受信者のユーザーID
  room_id: string; // ルームID
}

export type ICEMessage = {
  candidate: string; // ICE候補の文字列
  sdp_mid: string; // SDPのメディア識別子
  sdp_mline_index: number; // SDPのメディア行インデックス
  from: string; // 送信者のユーザーID
  to: string; // 受信者のユーザーID
  room_id: string; // ルームID
}