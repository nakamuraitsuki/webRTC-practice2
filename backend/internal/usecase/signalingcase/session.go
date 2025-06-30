package signalingcase

import (
	"context"

	"example.com/infrahandson/internal/domain/entity"
)

func (*SignalingUseCase) StartSession(ctx context.Context, roomID entity.RoomID, userID entity.UserID) error {
	// TODO: セッション開始ロジック
	return nil
}

func (*SignalingUseCase) LeaveSession(ctx context.Context, roomID entity.RoomID, userID entity.UserID) error {
	// TODO: セッション終了ロジック
	return nil
}
