package gorillawebsocket

import (
	"time"

	"example.com/infrahandson/internal/domain/entity"
)

// NOTE: UserIDなどは、string型をラップしているだけなので、Jsonパースに含めて問題ない
type TextMessageDTO struct {
	ID      entity.MessageID `json:"id"      mapstructure:"id"`
	RoomID  entity.RoomID    `json:"room_id" mapstructure:"room_id"`
	UserID  entity.UserID    `json:"user_id" mapstructure:"user_id"`
	Content string           `json:"content" mapstructure:"content"`
	SentAt  time.Time        `json:"sent_at" mapstructure:"sent_at"`
}

func (m *TextMessageDTO) ToEntity() *entity.Message {
	return entity.NewMessage(entity.MessageParams{
		ID:      m.ID,
		RoomID:  m.RoomID,
		UserID:  m.UserID,
		Content: m.Content,
		SentAt:  m.SentAt,
	})
}

func (m *TextMessageDTO) FromEntity(msg *entity.Message) {
	m.ID = msg.GetID()
	m.ID = msg.GetID()
	m.RoomID = msg.GetRoomID()
	m.UserID = msg.GetUserID()
	m.Content = msg.GetContent()
	m.SentAt = msg.GetSentAt()
}
