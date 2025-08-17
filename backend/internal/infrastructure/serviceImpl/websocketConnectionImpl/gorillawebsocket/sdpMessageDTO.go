package gorillawebsocket

import (
	"example.com/infrahandson/internal/domain/entity"
)

type SDPMessageDTO struct {
	SDPType entity.SDPType `json:"sdp_type"` // "offer" or "answer"
	Sdp     string         `json:"sdp"`
	From    entity.UserID  `json:"from"`
	To      entity.UserID  `json:"to"`
	RoomID  entity.RoomID  `json:"room_id"`
}

func (m *SDPMessageDTO) ToEntity() (*entity.SDPMessage, error) {
	return entity.NewSDPMessage(entity.SDPMessageInput{
		MsgType: m.SDPType,
		Sdp:     m.Sdp,
		From:    m.From,
		To:      m.To,
		RoomID:  m.RoomID,
	})
}

func (m *SDPMessageDTO) FromEntity(sdpMsg *entity.SDPMessage) {
	m.SDPType = sdpMsg.GetMsgType()
	m.Sdp = sdpMsg.GetSdp()
	m.From = sdpMsg.GetFrom()
	m.To = sdpMsg.GetTo()
	m.RoomID = sdpMsg.GetRoomID()
}
