export type TextMessage = {
  id: string; // 一意のID
  room_id: string; // ルームID
  user_id: string; // ユーザーID
  content: string; // メッセージ内容
  sent_at: string; // メッセージ送信日時（ISO形式）
}
