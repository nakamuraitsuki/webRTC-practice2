// 送信すべきメッセージの型定義
export type Message = {
  message_type: "text" | "sdp" | "ice";
  payload: any;
};