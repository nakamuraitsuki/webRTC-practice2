package signalingcase

import (
	"context"

	"example.com/infrahandson/internal/domain/entity"
)

func (*SignalingUseCase) SendCandidate(ctx context.Context, msg entity.ICECandidate) error {
	// TODO: ICE候補送信ロジック
	return nil
}
