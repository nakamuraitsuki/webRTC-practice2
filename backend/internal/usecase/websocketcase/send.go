package websocketcase

import (
	"context"
	"time"

	"example.com/infrahandson/internal/domain/entity"
	"example.com/infrahandson/internal/domain/service"
)

// SendMessageRequest構造体: メッセージ送信リクエスト
type SendTextRequest struct {
	RoomID  entity.RoomID
	Sender  entity.UserID
	Content string
}

// SendMessage メッセージ送信
func (w *WebsocketUseCase) SendTextMessage(ctx context.Context, req SendTextRequest) error {
	id, err := w.msgIDFactory.NewMessageID()
	if err != nil {
		return err
	}

	msg := entity.NewMessage(entity.MessageParams{
		ID:      id,
		RoomID:  req.RoomID,
		UserID:  req.Sender,
		Content: req.Content,
		SentAt:  time.Now(),
	})

	if err := w.msgRepo.CreateMessage(ctx, msg); err != nil {
		return err
	}

	if err := w.msgCache.AddMessage(ctx, req.RoomID, msg); err != nil {
		return err
	}

	err = w.websocketManager.BroadcastToRoom(ctx, req.RoomID, service.MsgTypeText, msg)
	if err != nil {
		return err
	}

	return nil
}

func (w *WebsocketUseCase) SendSDPMessage(ctx context.Context, sdpMsg *entity.SDPMessage) error {
	err := w.websocketManager.BroadcastToRoom(ctx, sdpMsg.GetRoomID(), service.MsgTypeSDP, sdpMsg)
	if err != nil {
		return err
	}
	return nil
}

func (w *WebsocketUseCase) SendICECandidate(ctx context.Context, iceCandidate *entity.ICECandidate) error {
	err := w.websocketManager.BroadcastToRoom(ctx, iceCandidate.GetRoomID(), service.MsgTypeICE, iceCandidate)
	if err != nil {
		return err
	}
	return nil
}