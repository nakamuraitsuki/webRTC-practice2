package signalingcase

import (
	"context"

	"example.com/infrahandson/internal/domain/entity"
	"example.com/infrahandson/internal/domain/service"
)

type StartSessionInput struct {
	RoomID entity.RoomID
	UserID entity.UserID
	Conn   service.WebSocketConnection
}

func (u *SignalingUseCase) StartSession(ctx context.Context, req StartSessionInput) error {
	id, err := u.clientIDFactory.NewWsClientID()
	if err != nil {
		return err
	}

	client := entity.NewWebsocketClient(entity.WebsocketClientParams{
		ID:     id,
		UserID: req.UserID,
		RoomID: req.RoomID,
	})

	err = u.wsClientRepo.CreateClient(ctx, client)
	if err != nil {
		return err
	}

	err = u.websocketManager.Register(ctx, req.Conn, req.UserID, req.RoomID)
	if err != nil {
		return err
	}
	return nil
}

type LeaveSessionInput struct {
	UserID entity.UserID
}

func (u *SignalingUseCase) LeaveSession(ctx context.Context, req LeaveSessionInput) error {
	conn, err := u.websocketManager.GetConnectionByUserID(ctx, req.UserID)
	if err != nil {
		return err
	}

	user, err := u.wsClientRepo.GetClientsByUserID(ctx, req.UserID)
	if err != nil {
		return err
	}

	err = u.websocketManager.Unregister(ctx, conn)
	if err != nil {
		return err
	}

	err = u.wsClientRepo.DeleteClient(ctx, user.GetID())
	if err != nil {
		return err
	}

	return nil
}
