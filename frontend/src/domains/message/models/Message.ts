import { TextMessage } from "../../TextMessage/models/TextMessage";

export type MessageTypeMap = {
  'text': TextMessage;
  'sdp': SDPMessage;
  'ice': ICEMessage;
}

// 抽象的に扱いたい場合があるのでデフォルト keyof MessageTypeMap
export type Message<T extends keyof MessageTypeMap = keyof MessageTypeMap> = {
  message_type: T;
  payload: MessageTypeMap[T];
};

export type SDPMessage = {
  sdp_type: 'offer' | 'answer';
  sdp: string; // SDPの内容
  from: string; // 送信者のユーザーID
  to: string; // 受信者のユーザーID
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