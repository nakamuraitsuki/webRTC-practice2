// signaling に必要な構造体を定義する
package entity

// SDPMessage は WebRTC の offer / answer を表すエンティティです。
// 多対多を想定し、RoomID + From + To の構造にしています。
type SDPMessage struct {
	Type string // "offer" or "answer"
	SDP  string
	From UserID
	To   UserID
	RoomID RoomID
}

// ICECandidate は WebRTC の通信に必要な ICE 候補情報を表します。
// 多対多を想定しているため、ルーム情報を含みます。
type ICECandidate struct {
	Candidate     string
	SdpMid        string
	SdpMLineIndex uint16
	From          UserID
	To            UserID
	RoomID        RoomID
}

// RTCSession はルーム単位の通話セッションを表します。
// 参加者の管理に使います（1対多、多対多対応）。
type RTCSession struct {
	ID         RTCSessionID
	RoomID     RoomID
	ParticipantIDs []UserID
}
