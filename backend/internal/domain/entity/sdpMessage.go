// signaling に必要な構造体を定義する
package entity

import "errors"

// SDPMessage は WebRTC の offer / answer を表すエンティティです。
// 多対多を想定し、RoomID + From + To の構造にしています。
type SDPType string

const (
	SDPTypeOffer  SDPType = "offer"
	SDPTypeAnswer SDPType = "answer"
)

type SDPMessage struct {
	msgType SDPType // "offer" or "answer"
	sdp     string
	from    UserID
	to      UserID
	roomID  RoomID
}

type SDPMessageInput struct {
	MsgType SDPType // "offer" or "answer"
	Sdp     string
	From    UserID
	To      UserID
	RoomID  RoomID
}

func (i *SDPMessageInput) Validate() error {
	if i.MsgType == "" {
		return errors.New("sdpMessageInput: MsgType is required")
	}
	if i.Sdp == "" {
		return errors.New("sdpMessageInput: Sdp is required")
	}
	if i.From == "" {
		return errors.New("sdpMessageInput: From is required")
	}
	if i.RoomID == "" {
		return errors.New("sdpMessageInput: RoomID is required")
	}
	return nil
}

func NewSDPMessage(input SDPMessageInput) (*SDPMessage, error) {
	if err := input.Validate(); err != nil {
		return nil, err
	}

	return &SDPMessage{
		msgType: input.MsgType,
		sdp:     input.Sdp,
		from:    input.From,
		to:      input.To,
		roomID:  input.RoomID,
	}, nil
}

// To をセットしたコピーを返す (Offer 一斉送信用)
func (s *SDPMessage) WithTo(to UserID) *SDPMessage {
	return &SDPMessage{
		msgType: s.msgType,
		sdp:     s.sdp,
		from:    s.from,
		to:      to,
		roomID:  s.roomID,
	}
}

func (s *SDPMessage) GetMsgType() SDPType {
	return s.msgType
}

func (s *SDPMessage) GetSdp() string {
	return s.sdp
}

func (s *SDPMessage) GetFrom() UserID {
	return s.from
}

func (s *SDPMessage) GetTo() UserID {
	return s.to
}

func (s *SDPMessage) GetRoomID() RoomID {
	return s.roomID
}
