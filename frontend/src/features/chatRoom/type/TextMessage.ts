// メッセージ履歴取得の時のレスポンス型定義
export type TextMessage = {
  id: string;
  user_id: string;
  room_id: string;
  sent_at: string; // RFC3339
  content: string;
};


