package websocketcase

import (
	"context"

	"example.com/infrahandson/internal/domain/entity"
)

type WebsocketUseCaseInterface interface {
	// ConnectUserToRoom: 接続・参加処理
	ConnectUserToRoom(ctx context.Context, req ConnectUserToRoomRequest) error

	// SendMessage: メッセージ送信
	SendTextMessage(ctx context.Context, req SendTextRequest) error

	SendSDPMessage(ctx context.Context, sdpMsg *entity.SDPMessage) error

	SendICECandidate(ctx context.Context, iceCandidate *entity.ICECandidate) error

	// DisconnectUser: 切断処理
	DisconnectUser(ctx context.Context, req DisconnectUserRequest) error
}
