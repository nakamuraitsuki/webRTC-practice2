package signalingcase

import (
	"context"

	"example.com/infrahandson/internal/domain/entity"
)

func (*SignalingUseCase) SendOffer(ctx context.Context, msg entity.SDPMessage) error {
	// TODO: SDPオファー送信ロジック
	return nil
}

func (*SignalingUseCase) SendAnswer(ctx context.Context, msg entity.SDPMessage) error {
	// TODO: SDPアンサー送信ロジック
	return nil
}